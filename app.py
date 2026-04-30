from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

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
        SELECT instructor.first_name, instructor.last_name, 
               department.dept_name
        FROM instructor
        JOIN department ON instructor.dept_id = department.dept_id
    """)
    rows = cursor.fetchall()
    conn.close()
    result = [{"first_name": r[0], "last_name": r[1], "department": r[2]} for r in rows]
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)