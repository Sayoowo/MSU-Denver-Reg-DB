import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { GraduationCap, BookOpen, Users, Search, ClipboardList } from "lucide-react";

const API = "http://localhost:5000";

const theme = {
  navy: "#003B5C",
  red: "#C8102E",
  charcoal: "#53565A",
  white: "#FFFFFF",
  mediumBlue: "#005EB8",
  lightGray: "#D9D9D6",
  bg: "#F8FAFC",
  panel: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
};

function authFetch(url, token, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });
}

function NavBtn({ label, active, color, onClick }) {
  const c = color || theme.navy;
  return (
    <button onClick={onClick} style={{ background: active ? c : "transparent", color: active ? theme.white : c, border: `1px solid ${c}`, borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontWeight: active ? 600 : 400 }}>
      {label}
    </button>
  );
}

function Header({ student, page, setPage, onLogout }) {
  return (
    <header style={{ borderBottom: `1px solid ${theme.border}`, background: theme.white }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: theme.navy, borderRadius: "12px", padding: "10px" }}>
            <GraduationCap style={{ color: theme.white, width: "24px", height: "24px" }} />
          </div>
          <div>
            <p style={{ color: theme.red, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>MSU Denver</p>
            <h1 style={{ color: theme.navy, margin: 0, fontSize: "18px", fontWeight: 600 }}>Student Registration</h1>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {!student && (
            <>
              <NavBtn label="Courses" active={page === "public_courses"} onClick={() => setPage("public_courses")} />
              <NavBtn label="Enrollments" active={page === "public_enrollments"} onClick={() => setPage("public_enrollments")} />
              <NavBtn label="Instructors" active={page === "public_instructors"} onClick={() => setPage("public_instructors")} />
              <NavBtn label="Student Login" active={page === "login"} color={theme.red} onClick={() => setPage("login")} />
            </>
          )}
          {student && (
            <>
              <div style={{ fontSize: "14px", color: theme.muted, padding: "6px 12px", border: `1px solid ${theme.border}`, borderRadius: "8px" }}>
                Logged in as <strong style={{ color: theme.text }}>{student.first_name} {student.last_name}</strong> • ID {student.id}
              </div>
              <NavBtn label="My Courses" active={page === "enrolled"} onClick={() => setPage("enrolled")} />
              <NavBtn label="Enroll" active={page === "options"} color={theme.red} onClick={() => setPage("options")} />
              <NavBtn label="Rosters" active={page === "rosters"} onClick={() => setPage("rosters")} />
              <NavBtn label="Logout" active={false} color={theme.red} onClick={onLogout} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: Number(studentId), name: name.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      onLogin(data.student, data.token);
    } catch (err) {
      setError("Could not connect to server. Make sure Flask is running.");
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "80vh", background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.mediumBlue} 70%, ${theme.red} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: theme.white, borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", margin: "2rem" }}>
        <h2 style={{ color: theme.navy, marginTop: 0 }}>Student Login</h2>
        <p style={{ color: theme.muted, fontSize: "14px" }}>Enter your full name and student ID.</p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="John The Great" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>Student ID</label>
            <input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="1" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          {error && <p style={{ background: `${theme.red}12`, color: theme.red, padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "1rem" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? theme.muted : theme.red, color: theme.white, border: "none", borderRadius: "8px", fontSize: "16px", cursor: loading ? "default" : "pointer", fontWeight: 600 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// MY COURSES PAGE
// Shows student's courses with Drop button
// Drop = sets status to 'dropped' (keeps history)
// ─────────────────────────────────────────────
function MyCoursesPage({ student, token, setPage }) {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dropping, setDropping] = useState(null);

  function loadCourses() {
    setLoading(true);
    authFetch(`${API}/students/${student.id}/enrollments`, token)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setMyCourses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load your courses.");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadCourses();
  }, [student.id, token]);

  async function handleDrop(enrollmentId) {
    if (!window.confirm("Are you sure you want to drop this course?")) return;
    setDropping(enrollmentId);
    try {
      const response = await authFetch(`${API}/enrollment/${enrollmentId}/drop`, token, {
        method: "PUT"
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Could not drop course");
      } else {
        loadCourses();
      }
    } catch (err) {
      alert("Could not drop course. Check Flask server.");
    }
    setDropping(null);
  }

  const activeCourses = myCourses.filter(c => c.status !== 'dropped');
  const totalCredits = activeCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[["Active Courses", activeCourses.length, theme.navy], ["Total Credits", totalCredits, theme.red], ["Student", `${student.first_name} ${student.last_name}`, theme.charcoal]].map(([label, val, color]) => (
          <Card key={label} style={{ borderRadius: "16px", border: `1px solid ${theme.border}` }}>
            <CardContent style={{ padding: "1.25rem" }}>
              <p style={{ color: theme.muted, fontSize: "13px" }}>{label}</p>
              <p style={{ color, fontSize: typeof val === "number" ? "28px" : "18px", fontWeight: 600, margin: "4px 0 0" }}>{val}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card style={{ borderRadius: "16px", border: `1px solid ${theme.border}` }}>
        <CardHeader>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <CardTitle style={{ color: theme.navy }}>My Enrolled Courses</CardTitle>
              <CardDescription>Your personal enrollments. Drop a course to remove it from your schedule.</CardDescription>
            </div>
            <button onClick={() => setPage("options")} style={{ background: theme.red, color: theme.white, border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: 500 }}>Browse More</button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p style={{ color: theme.muted, textAlign: "center" }}>Loading your courses...</p>}
          {error && <p style={{ color: theme.red, textAlign: "center" }}>{error}</p>}
          {!loading && !error && (
            <Table>
              <TableHeader style={{ background: `${theme.navy}08` }}>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCourses.length === 0 ? (
                  <TableRow><TableCell colSpan={6} style={{ textAlign: "center", color: theme.muted }}>No enrollments found.</TableCell></TableRow>
                ) : myCourses.map((c, i) => (
                  <TableRow key={i} style={{ opacity: c.status === 'dropped' ? 0.5 : 1 }}>
                    <TableCell style={{ fontWeight: 600, color: theme.navy }}>{c.code}</TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.credits}</TableCell>
                    <TableCell>{c.grade || "—"}</TableCell>
                    <TableCell>
                      <Badge style={{ background: c.status === "enrolled" ? `${theme.navy}12` : c.status === "completed" ? `${theme.mediumBlue}12` : `${theme.red}12`, color: c.status === "enrolled" ? theme.navy : c.status === "completed" ? theme.mediumBlue : theme.red }}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.status === "enrolled" ? (
                        <button
                          onClick={() => handleDrop(c.enrollment_id)}
                          disabled={dropping === c.enrollment_id}
                          style={{ background: "transparent", color: theme.red, border: `1px solid ${theme.red}`, borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}
                        >
                          {dropping === c.enrollment_id ? "Dropping..." : "Drop"}
                        </button>
                      ) : (
                        <span style={{ color: theme.muted, fontSize: "13px" }}>—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

// ─────────────────────────────────────────────
// COURSE OPTIONS PAGE
// Prevents duplicate enrollments by checking
// enrolledIds before showing Enroll button
// ─────────────────────────────────────────────
function CourseOptionsPage({ enrolledIds, onEnroll, courses }) {
  const [query, setQuery] = useState("");
  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) => [c.code, c.title].some((v) => String(v).toLowerCase().includes(q)));
  }, [query, courses]);

  return (
    <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ color: theme.red, fontSize: "13px", fontWeight: 500, margin: 0 }}>Course Registration</p>
          <h2 style={{ color: theme.navy, margin: "4px 0 0" }}>Available Courses</h2>
          <p style={{ color: theme.muted, fontSize: "13px", margin: "4px 0 0" }}>You cannot enroll in the same course twice.</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search style={{ position: "absolute", left: "12px", top: "12px", width: "16px", height: "16px", color: theme.muted }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." style={{ padding: "10px 10px 10px 36px", borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "14px", width: "280px" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <Card key={course.id} style={{ borderRadius: "16px", border: `1px solid ${isEnrolled ? theme.navy : theme.border}` }}>
              <CardHeader>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <Badge style={{ background: `${theme.navy}12`, color: theme.navy, borderRadius: "9999px" }}>{course.code}</Badge>
                      {isEnrolled && <Badge style={{ background: `${theme.red}12`, color: theme.red, borderRadius: "9999px" }}>✓ Enrolled</Badge>}
                    </div>
                    <CardTitle style={{ color: theme.text }}>{course.title}</CardTitle>
                  </div>
                  <div style={{ background: `${theme.mediumBlue}10`, borderRadius: "12px", padding: "8px 12px", textAlign: "center", minWidth: "60px" }}>
                    <p style={{ color: theme.mediumBlue, fontSize: "22px", fontWeight: 600, margin: 0 }}>{course.credits}</p>
                    <p style={{ color: theme.muted, fontSize: "11px", margin: 0 }}>credits</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <button
                  disabled={isEnrolled}
                  onClick={() => onEnroll(course.id)}
                  style={{ width: "100%", padding: "10px", background: isEnrolled ? theme.lightGray : theme.red, color: isEnrolled ? theme.charcoal : theme.white, border: "none", borderRadius: "8px", cursor: isEnrolled ? "not-allowed" : "pointer", fontWeight: 600 }}
                >
                  {isEnrolled ? "Already Enrolled" : "Enroll in this Class"}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}

function PublicCoursesPage({ courses }) {
  return (
    <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <p style={{ color: theme.red, fontSize: "13px", fontWeight: 500 }}>Course Catalog</p>
      <h2 style={{ color: theme.navy, marginTop: "4px" }}>All Courses</h2>
      <Card style={{ borderRadius: "16px", border: `1px solid ${theme.border}` }}>
        <CardHeader>
          <CardTitle style={{ color: theme.navy, display: "flex", alignItems: "center", gap: "8px" }}><BookOpen style={{ width: "20px", height: "20px" }} /> Course List</CardTitle>
          <CardDescription>All available courses in the database.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader style={{ background: `${theme.navy}08` }}>
              <TableRow><TableHead>Code</TableHead><TableHead>Title</TableHead><TableHead>Credits</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell style={{ fontWeight: 600, color: theme.navy }}>{c.code}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.credits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

function PublicEnrollmentsPage({ enrollments }) {
  return (
    <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <p style={{ color: theme.red, fontSize: "13px", fontWeight: 500 }}>Enrollment Records</p>
      <h2 style={{ color: theme.navy, marginTop: "4px" }}>All Enrollments</h2>
      <Card style={{ borderRadius: "16px", border: `1px solid ${theme.border}` }}>
        <CardHeader>
          <CardTitle style={{ color: theme.navy, display: "flex", alignItems: "center", gap: "8px" }}><ClipboardList style={{ width: "20px", height: "20px" }} /> Enrollment Records</CardTitle>
          <CardDescription>All enrollment records — duplicates removed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader style={{ background: `${theme.navy}08` }}>
              <TableRow><TableHead>Student</TableHead><TableHead>Course</TableHead><TableHead>Grade</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.first_name} {row.last_name}</TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.grade || "—"}</TableCell>
                  <TableCell>
                    <Badge style={{ background: row.status === "enrolled" ? `${theme.navy}12` : row.status === "completed" ? `${theme.mediumBlue}12` : `${theme.red}12`, color: row.status === "enrolled" ? theme.navy : row.status === "completed" ? theme.mediumBlue : theme.red }}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

function PublicInstructorsPage({ instructors }) {
  return (
    <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <p style={{ color: theme.red, fontSize: "13px", fontWeight: 500 }}>Faculty</p>
      <h2 style={{ color: theme.navy, marginTop: "4px" }}>All Instructors</h2>
      <Card style={{ borderRadius: "16px", border: `1px solid ${theme.border}` }}>
        <CardHeader>
          <CardTitle style={{ color: theme.navy, display: "flex", alignItems: "center", gap: "8px" }}><Users style={{ width: "20px", height: "20px" }} /> Instructor List</CardTitle>
          <CardDescription>All instructors and their departments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader style={{ background: `${theme.navy}08` }}>
              <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((inst, i) => (
                <TableRow key={i}>
                  <TableCell style={{ fontWeight: 600 }}>{inst.first_name} {inst.last_name}</TableCell>
                  <TableCell>{inst.email}</TableCell>
                  <TableCell>{inst.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

function CourseRostersPage({ enrollments, courses }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || null);
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const rosterRows = enrollments.filter(e => e.course === selectedCourse?.title && e.status !== 'dropped');

  return (
    <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <p style={{ color: theme.red, fontSize: "13px", fontWeight: 500 }}>Course Rosters</p>
      <h2 style={{ color: theme.navy, marginTop: "4px" }}>Students by Course</h2>
      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "1.5rem" }}>
        <Card style={{ borderRadius: "16px", border: `1px solid ${theme.border}` }}>
          <CardHeader><CardTitle style={{ color: theme.navy }}>Select a Course</CardTitle></CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {courses.map((course) => {
              const count = enrollments.filter(e => e.course === course.title && e.status !== 'dropped').length;
              const isSelected = selectedCourseId === course.id;
              return (
                <button key={course.id} onClick={() => setSelectedCourseId(course.id)} style={{ width: "100%", borderRadius: "12px", border: `1px solid ${isSelected ? theme.navy : theme.border}`, background: isSelected ? `${theme.navy}08` : theme.white, padding: "12px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 600, color: theme.navy, margin: 0 }}>{course.code}</p>
                      <p style={{ fontSize: "13px", color: theme.text, margin: "2px 0 0" }}>{course.title}</p>
                    </div>
                    <Badge style={{ background: `${theme.red}12`, color: theme.red, borderRadius: "9999px" }}>{count}</Badge>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
        <Card style={{ borderRadius: "16px", border: `1px solid ${theme.border}` }}>
          <CardHeader>
            <CardTitle style={{ color: theme.navy }}>{selectedCourse?.code} Roster</CardTitle>
            <CardDescription>{selectedCourse?.title} — active enrollments only</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader style={{ background: `${theme.navy}08` }}>
                <TableRow><TableHead>Student</TableHead><TableHead>Grade</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {rosterRows.length > 0 ? rosterRows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell style={{ fontWeight: 500 }}>{row.first_name} {row.last_name}</TableCell>
                    <TableCell>{row.grade || "—"}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={3} style={{ textAlign: "center", color: theme.muted }}>No active students in this course.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function MSURegistrationUIPrototype() {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("login");
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetch(`${API}/courses`).then(r => r.json()).then(setCourses);
    fetch(`${API}/enrollments`).then(r => r.json()).then(setEnrollments);
    fetch(`${API}/instructors`).then(r => r.json()).then(setInstructors);
  }, []);

  function handleLogin(foundStudent, jwtToken) {
    setStudent(foundStudent);
    setToken(jwtToken);
    setPage("enrolled");
  }

  function handleLogout() {
    setStudent(null);
    setToken(null);
    setPage("login");
    setEnrolledIds([]);
  }

  async function handleEnroll(courseId) {
    if (!enrolledIds.includes(courseId)) {
      try {
        const response = await authFetch(`${API}/enroll`, token, {
          method: "POST",
          body: JSON.stringify({ student_id: student.id, section_id: courseId })
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Enrollment failed");
          return;
        }
        setEnrolledIds([...enrolledIds, courseId]);
        const updated = await fetch(`${API}/enrollments`).then(r => r.json());
        setEnrollments(updated);
      } catch (err) {
        alert("Enrollment failed. Check Flask server.");
      }
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text }}>
      <Header student={student} page={page} setPage={setPage} onLogout={handleLogout} />
      {!student && page === "login" && <LoginPage onLogin={handleLogin} />}
      {!student && page === "public_courses" && <PublicCoursesPage courses={courses} />}
      {!student && page === "public_enrollments" && <PublicEnrollmentsPage enrollments={enrollments} />}
      {!student && page === "public_instructors" && <PublicInstructorsPage instructors={instructors} />}
      {student && page === "enrolled" && <MyCoursesPage student={student} token={token} setPage={setPage} />}
      {student && page === "options" && <CourseOptionsPage enrolledIds={enrolledIds} onEnroll={handleEnroll} courses={courses} />}
      {student && page === "rosters" && <CourseRostersPage enrollments={enrollments} courses={courses} />}
    </div>
  );
}