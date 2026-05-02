from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import psycopg2
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")
jwt = JWTManager(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

def get_db():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD")
    )
    return conn

def validate_fields(data, required_fields):
    if not data:
        return "No data provided"
    for field in required_fields:
        if field not in data or data[field] is None:
            return f"Missing required field: {field}"
    return None

# ─────────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────────
@app.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    data = request.get_json()
    error = validate_fields(data, ['student_id', 'name'])
    if error:
        return jsonify({"error": error}), 400

    student_id = data.get('student_id')
    name = data.get('name').strip().lower()

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT student_id, first_name, last_name, email FROM students WHERE student_id = %s",
            (student_id,)
        )
        student = cursor.fetchone()
        conn.close()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        full_name = f"{student[1]} {student[2]}".lower()
        if full_name != name:
            return jsonify({"error": "Name does not match"}), 401

        token = create_access_token(identity=str(student[0]))
        return jsonify({
            "token": token,
            "student": {
                "id": student[0],
                "first_name": student[1],
                "last_name": student[2],
                "email": student[3]
            }
        })
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# GET ALL STUDENTS
# ─────────────────────────────────────────────
@app.route('/students', methods=['GET'])
@limiter.limit("100 per minute")
def get_students():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT student_id, first_name, last_name, email FROM students")
        rows = cursor.fetchall()
        conn.close()
        students = [{"id": r[0], "first_name": r[1], "last_name": r[2], "email": r[3]} for r in rows]
        return jsonify(students)
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# GET STUDENT'S OWN ENROLLMENTS
# Protected — JWT required
# ─────────────────────────────────────────────
@app.route('/students/<int:student_id>/enrollments', methods=['GET'])
@jwt_required()
@limiter.limit("100 per minute")
def get_student_enrollments(student_id):
    current_student_id = int(get_jwt_identity())
    if current_student_id != student_id:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT DISTINCT ON (course.course_id)
                   enrollment.enrollment_id,
                   course.course_id,
                   course.course_code,
                   course.title,
                   course.credits,
                   enrollment.grade,
                   enrollment.status
            FROM enrollment
            JOIN section ON enrollment.section_id = section.section_id
            JOIN course ON section.course_id = course.course_id
            WHERE enrollment.student_id = %s
            ORDER BY course.course_id, enrollment.enrollment_id DESC
        """, (student_id,))
        rows = cursor.fetchall()
        conn.close()
        result = [{"enrollment_id": r[0], "id": r[1], "code": r[2], "title": r[3], "credits": r[4], "grade": r[5], "status": r[6]} for r in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# GET ALL ENROLLMENTS (public)
# Uses DISTINCT to prevent duplicates
# ─────────────────────────────────────────────
@app.route('/enrollments', methods=['GET'])
@limiter.limit("100 per minute")
def get_enrollments():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT DISTINCT ON (students.student_id, course.course_id)
                   enrollment.enrollment_id,
                   students.first_name,
                   students.last_name,
                   course.title,
                   enrollment.grade,
                   enrollment.status
            FROM students
            JOIN enrollment ON students.student_id = enrollment.student_id
            JOIN section ON enrollment.section_id = section.section_id
            JOIN course ON section.course_id = course.course_id
            ORDER BY students.student_id, course.course_id, enrollment.enrollment_id DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        result = [{"enrollment_id": r[0], "first_name": r[1], "last_name": r[2], "course": r[3], "grade": r[4], "status": r[5]} for r in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# GET ALL COURSES
# ─────────────────────────────────────────────
@app.route('/courses', methods=['GET'])
@limiter.limit("100 per minute")
def get_courses():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT course_id, course_code, title, credits FROM course")
        rows = cursor.fetchall()
        conn.close()
        courses = [{"id": r[0], "code": r[1], "title": r[2], "credits": r[3]} for r in rows]
        return jsonify(courses)
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# GET ALL INSTRUCTORS
# ─────────────────────────────────────────────
@app.route('/instructors', methods=['GET'])
@limiter.limit("100 per minute")
def get_instructors():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT instructor.instructor_id, instructor.first_name, instructor.last_name,
                   instructor.email, department.dept_name
            FROM instructor
            JOIN department ON instructor.dept_id = department.dept_id
        """)
        rows = cursor.fetchall()
        conn.close()
        result = [{"id": r[0], "first_name": r[1], "last_name": r[2], "email": r[3], "department": r[4]} for r in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# ENROLL STUDENT
# Protected — JWT required
# Prevents duplicates before inserting
# ─────────────────────────────────────────────
@app.route('/enroll', methods=['POST'])
@jwt_required()
@limiter.limit("20 per minute")
def enroll_student():
    current_student_id = int(get_jwt_identity())
    data = request.get_json()

    error = validate_fields(data, ['section_id'])
    if error:
        return jsonify({"error": error}), 400

    section_id = data.get('section_id') or data.get('course_id')

    try:
        conn = get_db()
        cursor = conn.cursor()

        # check section exists
        cursor.execute("SELECT section_id, max_students FROM section WHERE section_id = %s", (section_id,))
        section = cursor.fetchone()
        if not section:
            conn.close()
            return jsonify({"error": "Section not found"}), 404

        # check not already enrolled — prevents duplicates
        cursor.execute("""
            SELECT enrollment_id FROM enrollment
            WHERE student_id = %s AND section_id = %s AND status != 'dropped'
        """, (current_student_id, section_id))
        existing = cursor.fetchone()
        if existing:
            conn.close()
            return jsonify({"error": "Already enrolled in this section"}), 409

        # check capacity
        cursor.execute("""
            SELECT COUNT(*) FROM enrollment
            WHERE section_id = %s AND status = 'enrolled'
        """, (section_id,))
        count = cursor.fetchone()[0]
        if count >= section[1]:
            conn.close()
            return jsonify({"error": "Section is full"}), 409

        # insert enrollment
        cursor.execute("""
            INSERT INTO enrollment (student_id, section_id, enrolled_on, status)
            VALUES (%s, %s, CURRENT_DATE, 'enrolled')
        """, (current_student_id, section_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Enrolled successfully"})

    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# DROP COURSE
# Protected — JWT required
# Updates status to 'dropped' instead of
# deleting — keeps history in database
# Students can only drop their own courses
# ─────────────────────────────────────────────
@app.route('/enrollment/<int:enrollment_id>/drop', methods=['PUT'])
@jwt_required()
@limiter.limit("20 per minute")
def drop_course(enrollment_id):
    current_student_id = int(get_jwt_identity())

    try:
        conn = get_db()
        cursor = conn.cursor()

        # check enrollment exists and belongs to this student
        cursor.execute("""
            SELECT student_id, status FROM enrollment
            WHERE enrollment_id = %s
        """, (enrollment_id,))
        enrollment = cursor.fetchone()

        if not enrollment:
            conn.close()
            return jsonify({"error": "Enrollment not found"}), 404

        # security check — can only drop your own courses
        if enrollment[0] != current_student_id:
            conn.close()
            return jsonify({"error": "Unauthorized — you can only drop your own courses"}), 403

        if enrollment[1] == 'dropped':
            conn.close()
            return jsonify({"error": "Already dropped"}), 409

        # update status to dropped — keeps history
        cursor.execute("""
            UPDATE enrollment SET status = 'dropped'
            WHERE enrollment_id = %s
        """, (enrollment_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Course dropped successfully"})

    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# DELETE ENROLLMENT COMPLETELY
# Protected — JWT required
# Hard delete — removes from database entirely
# Only use when dropping isn't enough
# ─────────────────────────────────────────────
@app.route('/enrollment/<int:enrollment_id>', methods=['DELETE'])
@jwt_required()
@limiter.limit("10 per minute")
def delete_enrollment(enrollment_id):
    current_student_id = int(get_jwt_identity())

    try:
        conn = get_db()
        cursor = conn.cursor()

        # check enrollment belongs to this student
        cursor.execute("""
            SELECT student_id FROM enrollment
            WHERE enrollment_id = %s
        """, (enrollment_id,))
        enrollment = cursor.fetchone()

        if not enrollment:
            conn.close()
            return jsonify({"error": "Enrollment not found"}), 404

        if enrollment[0] != current_student_id:
            conn.close()
            return jsonify({"error": "Unauthorized"}), 403

        # hard delete
        cursor.execute("DELETE FROM enrollment WHERE enrollment_id = %s", (enrollment_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Enrollment deleted"})

    except Exception as e:
        return jsonify({"error": "Server error"}), 500

# ─────────────────────────────────────────────
# ERROR HANDLERS
# ─────────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(429)
def rate_limit_exceeded(e):
    return jsonify({"error": "Too many requests — slow down"}), 429

if __name__ == '__main__':
    app.run(debug=True)