from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)


def get_db():
    conn = psycopg2.connect(
        host="localhost",
        database="msu_registration",
        user="postgres",
        password="kobeisthat"
    )
    return conn

@app.route('/students', methods=['GET'])
def get_students():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT student_id, first_name, last_name, email FROM students")
    rows = cursor.fetchall()
    conn.close()
    students = [{"id": r[0], "first_name": r[1], "last_name": r[2], "email": r[3]} for r in rows]
    return jsonify(students)

@app.route('/students/<int:student_id>/enrollments', methods=['GET'])
def get_student_enrollments(student_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT course.course_id, course.course_code, course.title, course.credits,
               enrollment.grade, enrollment.status
        FROM enrollment
        JOIN section ON enrollment.section_id = section.section_id
        JOIN course ON section.course_id = course.course_id
        WHERE enrollment.student_id = %s
    """, (student_id,))
    rows = cursor.fetchall()
    conn.close()
    result = [{"id": r[0], "code": r[1], "title": r[2], "credits": r[3], "grade": r[4], "status": r[5]} for r in rows]
    return jsonify(result)

@app.route('/enrollments', methods=['GET'])
def get_enrollments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT students.first_name, students.last_name, 
               course.title, enrollment.grade, enrollment.status
        FROM students
        JOIN enrollment ON students.student_id = enrollment.student_id
        JOIN section ON enrollment.section_id = section.section_id
        JOIN course ON section.course_id = course.course_id
    """)
    rows = cursor.fetchall()
    conn.close()
    result = [{"first_name": r[0], "last_name": r[1], "course": r[2], "grade": r[3], "status": r[4]} for r in rows]
    return jsonify(result)

@app.route('/courses', methods=['GET'])
def get_courses():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT course_id, course_code, title, credits FROM course")
    rows = cursor.fetchall()
    conn.close()
    courses = [{"id": r[0], "code": r[1], "title": r[2], "credits": r[3]} for r in rows]
    return jsonify(courses)

@app.route('/instructors', methods=['GET'])
def get_instructors():
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

@app.route('/enroll', methods=['POST'])
def enroll_student():
    conn = get_db()
    cursor = conn.cursor()
    data = request.get_json()
    print("received data:", data)
    student_id = data.get('student_id') or data.get('id')
    section_id = data.get('section_id') or data.get('course_id')
    cursor.execute("""
        INSERT INTO enrollment (student_id, section_id, enrolled_on, status)
        VALUES (%s, %s, CURRENT_DATE, 'enrolled')
    """, (student_id, section_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "enrolled successfully"})

if __name__ == '__main__':
    app.run(debug=True)