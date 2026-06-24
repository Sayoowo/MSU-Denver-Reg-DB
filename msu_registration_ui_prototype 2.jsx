import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { GraduationCap, BookOpen, Building2, User, Users, Search, LogIn, CheckCircle2, CalendarDays, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

const theme = {
  navy: "#003B5C",
  red: "#C8102E",
  charcoal: "#53565A",
  white: "#FFFFFF",
  mediumBlue: "#005EB8",
  darkRed: "#862633",
  black: "#000000",
  retroBlue: "#6EC1E4",
  brightRed: "#EF3340",
  lightGray: "#D9D9D6",
  bg: "#F8FAFC",
  panel: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
};

const sampleStudents = [
  { student_id: 1001, first_name: "Ava", last_name: "Martinez", email: "ava.martinez@msudenver.edu" },
  { student_id: 1002, first_name: "Noah", last_name: "Nguyen", email: "noah.nguyen@msudenver.edu" },
  { student_id: 1003, first_name: "Mia", last_name: "Lopez", email: "mia.lopez@msudenver.edu" },
];

const courseOptions = [
  {
    section_id: 401,
    course_id: 301,
    course_code: "CS 1050",
    title: "Computer Science I",
    credits: 3,
    instructor: "Dr. Chen",
    building: "Aerospace & Engineering Sciences",
    room: "AES 210",
    semester: "Fall",
    year: 2026,
    schedule: "MW 10:00–11:15",
  },
  {
    section_id: 402,
    course_id: 302,
    course_code: "MTH 2140",
    title: "Intro to Statistics",
    credits: 3,
    instructor: "Prof. Ramirez",
    building: "Jordan Student Success Building",
    room: "JSSB 420",
    semester: "Fall",
    year: 2026,
    schedule: "TR 12:30–13:45",
  },
  {
    section_id: 403,
    course_id: 303,
    course_code: "BIO 1080",
    title: "General Biology",
    credits: 4,
    instructor: "Dr. Patel",
    building: "Science Building",
    room: "SI 118",
    semester: "Spring",
    year: 2027,
    schedule: "MWF 09:00–09:50",
  },
  {
    section_id: 404,
    course_id: 304,
    course_code: "ENG 1020",
    title: "College Writing and Research",
    credits: 3,
    instructor: "Prof. Johnson",
    building: "Central Classroom",
    room: "CN 203",
    semester: "Fall",
    year: 2026,
    schedule: "TR 09:30–10:45",
  },
];

const initialEnrollmentIds = [401, 402];

const allEnrollments = [
  { enrollment_id: 501, student_id: 1001, section_id: 401, enrolled_on: "2026-04-10", grade: "IP" },
  { enrollment_id: 502, student_id: 1001, section_id: 402, enrolled_on: "2026-04-12", grade: "IP" },
  { enrollment_id: 503, student_id: 1002, section_id: 401, enrolled_on: "2026-04-13", grade: "IP" },
  { enrollment_id: 504, student_id: 1003, section_id: 403, enrolled_on: "2026-04-14", grade: "IP" },
];

function getStudentName(studentId) {
  const student = sampleStudents.find((s) => s.student_id === studentId);
  return student ? `${student.first_name} ${student.last_name}` : "Unknown Student";
}

function getCourseBySection(sectionId) {
  return courseOptions.find((course) => course.section_id === sectionId);
}

function Header({ student, page, setPage }) {
  return (
    <header className="border-b" style={{ borderColor: theme.border, background: theme.white }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl p-3" style={{ background: theme.navy }}>
            <GraduationCap className="h-6 w-6" style={{ color: theme.white }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: theme.red }}>MSU Denver</p>
            <h1 className="text-xl font-semibold" style={{ color: theme.navy }}>Student Registration</h1>
          </div>
        </div>

        {student && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border px-4 py-2 text-sm" style={{ borderColor: theme.border, background: `${theme.navy}05` }}>
              <span style={{ color: theme.muted }}>Logged in as </span>
              <strong style={{ color: theme.text }}>{student.first_name} {student.last_name}</strong>
              <span style={{ color: theme.muted }}> • ID {student.student_id}</span>
            </div>
            <div className="flex gap-2">
              <Button variant={page === "enrolled" ? "default" : "outline"} className="rounded-xl" style={page === "enrolled" ? { background: theme.navy, color: theme.white } : {}} onClick={() => setPage("enrolled")}>Enrolled</Button>
              <Button variant={page === "options" ? "default" : "outline"} className="rounded-xl" style={page === "options" ? { background: theme.red, color: theme.white } : {}} onClick={() => setPage("options")}>Course Options</Button>
              <Button variant={page === "courses" ? "default" : "outline"} className="rounded-xl" style={page === "courses" ? { background: theme.navy, color: theme.white } : {}} onClick={() => setPage("courses")}>Courses</Button>
              <Button variant={page === "enrollmentList" ? "default" : "outline"} className="rounded-xl" style={page === "enrollmentList" ? { background: theme.navy, color: theme.white } : {}} onClick={() => setPage("enrollmentList")}>Enrollments</Button>
              <Button variant={page === "rosters" ? "default" : "outline"} className="rounded-xl" style={page === "rosters" ? { background: theme.red, color: theme.white } : {}} onClick={() => setPage("rosters")}>Rosters</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function LoginPage({ onLogin }) {
  const [name, setName] = useState("Ava Martinez");
  const [studentId, setStudentId] = useState("1001");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    const normalizedName = name.trim().toLowerCase();
    const idNumber = Number(studentId);
    const match = sampleStudents.find((student) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      return student.student_id === idNumber && fullName === normalizedName;
    });

    if (!match) {
      setError("No student matched that name and ID. Try Ava Martinez / 1001 for the demo.");
      return;
    }

    setError("");
    onLogin(match);
  }

  return (
    <main className="min-h-[calc(100vh-72px)]" style={{ background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.mediumBlue} 70%, ${theme.red} 100%)` }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-white">
          <Badge className="mb-4 rounded-full" style={{ background: theme.white, color: theme.navy }}>Student Portal</Badge>
          <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Register for classes using your student name and ID.</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/85">This first page matches your partner's requirement: students enter their name and student ID before seeing their enrolled courses.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [User, "Login", "Verify student_id and name."],
              [BookOpen, "View", "Show courses already enrolled."],
              [Search, "Choose", "Browse course options and details."],
            ].map(([Icon, title, body]) => (
              <div key={title} className="rounded-2xl border p-4" style={{ borderColor: `${theme.white}30`, background: `${theme.white}12` }}>
                <Icon className="h-6 w-6" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-white/75">{body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="rounded-3xl border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: theme.navy }}>Student Login</CardTitle>
              <CardDescription>Enter the student's full name and ID number.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input className="rounded-xl" value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Ava Martinez" />
                </div>
                <div className="space-y-2">
                  <Label>Student ID</Label>
                  <Input className="rounded-xl" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Example: 1001" />
                </div>
                {error && <p className="rounded-xl px-3 py-2 text-sm" style={{ background: `${theme.red}12`, color: theme.red }}>{error}</p>}
                <Button type="submit" className="w-full rounded-xl py-6 text-base" style={{ background: theme.red, color: theme.white }}>
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}

function EnrolledCoursesPage({ enrolledCourses, setPage }) {
  const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
          <CardContent className="p-5">
            <p className="text-sm" style={{ color: theme.muted }}>Courses Enrolled</p>
            <p className="mt-2 text-3xl font-semibold" style={{ color: theme.navy }}>{enrolledCourses.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
          <CardContent className="p-5">
            <p className="text-sm" style={{ color: theme.muted }}>Total Credits</p>
            <p className="mt-2 text-3xl font-semibold" style={{ color: theme.red }}>{totalCredits}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
          <CardContent className="p-5">
            <p className="text-sm" style={{ color: theme.muted }}>Current Term</p>
            <p className="mt-2 text-3xl font-semibold" style={{ color: theme.charcoal }}>Fall 2026</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle style={{ color: theme.navy }}>My Enrolled Courses</CardTitle>
            <CardDescription>This is the second page your partner requested.</CardDescription>
          </div>
          <Button className="rounded-xl" style={{ background: theme.red, color: theme.white }} onClick={() => setPage("options")}>View Course Options</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: theme.border }}>
            <Table>
              <TableHeader style={{ background: `${theme.navy}08` }}>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Building / Room</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledCourses.map((course) => (
                  <TableRow key={course.section_id}>
                    <TableCell className="font-semibold" style={{ color: theme.navy }}>{course.course_code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.building}, {course.room}</TableCell>
                    <TableCell>{course.schedule}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function CourseOptionsPage({ enrolledIds, onEnroll }) {
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return courseOptions;
    return courseOptions.filter((course) =>
      [course.course_code, course.title, course.instructor, course.building, course.room, course.schedule]
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: theme.red }}>Course Registration</p>
          <h2 className="text-3xl font-semibold tracking-tight" style={{ color: theme.navy }}>Course Options</h2>
          <p className="mt-2 max-w-3xl text-sm" style={{ color: theme.muted }}>This page shows all course options, classes already enrolled, instructors, buildings, schedules, and credit information.</p>
        </div>
        <div className="relative min-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4" style={{ color: theme.muted }} />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search course, instructor, building..." className="rounded-xl pl-9" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.section_id);
          return (
            <Card key={course.section_id} className="rounded-2xl border shadow-sm" style={{ borderColor: isEnrolled ? theme.navy : theme.border, background: theme.panel }}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full" style={{ background: `${theme.navy}12`, color: theme.navy }}>{course.course_code}</Badge>
                      {isEnrolled && <Badge className="rounded-full" style={{ background: `${theme.red}12`, color: theme.red }}><CheckCircle2 className="mr-1 h-3 w-3" /> Enrolled</Badge>}
                    </div>
                    <CardTitle className="mt-3" style={{ color: theme.text }}>{course.title}</CardTitle>
                    <CardDescription>{course.semester} {course.year} • Section {course.section_id}</CardDescription>
                  </div>
                  <div className="rounded-2xl px-4 py-3 text-center" style={{ background: `${theme.mediumBlue}10` }}>
                    <p className="text-2xl font-semibold" style={{ color: theme.mediumBlue }}>{course.credits}</p>
                    <p className="text-xs" style={{ color: theme.muted }}>credits</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border p-3" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.navy }}><User className="h-4 w-4" /> Instructor</div>
                    <p className="mt-1 text-sm" style={{ color: theme.text }}>{course.instructor}</p>
                  </div>
                  <div className="rounded-xl border p-3" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.navy }}><Building2 className="h-4 w-4" /> Building</div>
                    <p className="mt-1 text-sm" style={{ color: theme.text }}>{course.building}, {course.room}</p>
                  </div>
                  <div className="rounded-xl border p-3 md:col-span-2" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.navy }}><CalendarDays className="h-4 w-4" /> Schedule</div>
                    <p className="mt-1 text-sm" style={{ color: theme.text }}>{course.schedule}</p>
                  </div>
                </div>
                <Button disabled={isEnrolled} onClick={() => onEnroll(course.section_id)} className="w-full rounded-xl" style={{ background: isEnrolled ? theme.lightGray : theme.red, color: isEnrolled ? theme.charcoal : theme.white }}>
                  {isEnrolled ? "Already Enrolled" : "Enroll in this Class"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}

function AllCoursesPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <div>
        <p className="text-sm font-medium" style={{ color: theme.red }}>Course Catalog</p>
        <h2 className="text-3xl font-semibold tracking-tight" style={{ color: theme.navy }}>All Courses</h2>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>Separate GUI page for viewing course records and section details.</p>
      </div>

      <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: theme.navy }}><BookOpen className="h-5 w-5" /> Course List</CardTitle>
          <CardDescription>Shows course, instructor, building, room, schedule, and credits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: theme.border }}>
            <Table>
              <TableHeader style={{ background: `${theme.navy}08` }}>
                <TableRow>
                  <TableHead>Section ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Building / Room</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseOptions.map((course) => (
                  <TableRow key={course.section_id}>
                    <TableCell>{course.section_id}</TableCell>
                    <TableCell className="font-semibold" style={{ color: theme.navy }}>{course.course_code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.building}, {course.room}</TableCell>
                    <TableCell>{course.schedule}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function EnrollmentListPage({ studentEnrollments }) {
  const rows = studentEnrollments.map((enrollment) => {
    const course = getCourseBySection(enrollment.section_id);
    return {
      ...enrollment,
      studentName: getStudentName(enrollment.student_id),
      courseCode: course?.course_code ?? "Unknown",
      courseTitle: course?.title ?? "Unknown Course",
      instructor: course?.instructor ?? "Unknown Instructor",
      credits: course?.credits ?? "—",
    };
  });

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <div>
        <p className="text-sm font-medium" style={{ color: theme.red }}>Enrollment Records</p>
        <h2 className="text-3xl font-semibold tracking-tight" style={{ color: theme.navy }}>All Enrollments</h2>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>Separate GUI page for viewing enrollment records from the ENROLLMENT table.</p>
      </div>

      <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: theme.navy }}><ClipboardList className="h-5 w-5" /> Enrollment List</CardTitle>
          <CardDescription>Shows which students are enrolled in which sections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: theme.border }}>
            <Table>
              <TableHeader style={{ background: `${theme.navy}08` }}>
                <TableRow>
                  <TableHead>Enrollment ID</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Enrolled On</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.enrollment_id}>
                    <TableCell>{row.enrollment_id}</TableCell>
                    <TableCell>{row.student_id}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell><span className="font-semibold" style={{ color: theme.navy }}>{row.courseCode}</span> — {row.courseTitle}</TableCell>
                    <TableCell>{row.instructor}</TableCell>
                    <TableCell>{row.credits}</TableCell>
                    <TableCell>{row.enrolled_on}</TableCell>
                    <TableCell>{row.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function CourseRostersPage({ studentEnrollments }) {
  const [selectedSectionId, setSelectedSectionId] = useState(courseOptions[0].section_id);
  const selectedCourse = getCourseBySection(selectedSectionId);
  const rosterRows = studentEnrollments
    .filter((enrollment) => enrollment.section_id === selectedSectionId)
    .map((enrollment) => ({
      ...enrollment,
      studentName: getStudentName(enrollment.student_id),
    }));

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <div>
        <p className="text-sm font-medium" style={{ color: theme.red }}>Course Rosters</p>
        <h2 className="text-3xl font-semibold tracking-tight" style={{ color: theme.navy }}>Students Enrolled by Course</h2>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>This is the GUI your partner requested: choose a course and see the list of students enrolled in it.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.navy }}>Select a Course</CardTitle>
            <CardDescription>Click a course section to view its roster.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {courseOptions.map((course) => {
              const count = studentEnrollments.filter((e) => e.section_id === course.section_id).length;
              const isSelected = selectedSectionId === course.section_id;
              return (
                <button
                  key={course.section_id}
                  onClick={() => setSelectedSectionId(course.section_id)}
                  className="w-full rounded-2xl border p-4 text-left transition"
                  style={{
                    borderColor: isSelected ? theme.navy : theme.border,
                    background: isSelected ? `${theme.navy}08` : theme.white,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold" style={{ color: theme.navy }}>{course.course_code}</p>
                      <p className="text-sm" style={{ color: theme.text }}>{course.title}</p>
                      <p className="mt-1 text-xs" style={{ color: theme.muted }}>{course.instructor} • {course.building}</p>
                    </div>
                    <Badge className="rounded-full" style={{ background: `${theme.red}12`, color: theme.red }}>{count} students</Badge>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm" style={{ borderColor: theme.border }}>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2" style={{ color: theme.navy }}><Users className="h-5 w-5" /> {selectedCourse?.course_code} Roster</CardTitle>
                <CardDescription>{selectedCourse?.title} • {selectedCourse?.semester} {selectedCourse?.year}</CardDescription>
              </div>
              <Badge className="rounded-full" style={{ background: `${theme.navy}12`, color: theme.navy }}>{rosterRows.length} enrolled</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border p-3" style={{ borderColor: theme.border }}>
                <p className="text-xs" style={{ color: theme.muted }}>Instructor</p>
                <p className="font-medium" style={{ color: theme.text }}>{selectedCourse?.instructor}</p>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: theme.border }}>
                <p className="text-xs" style={{ color: theme.muted }}>Location</p>
                <p className="font-medium" style={{ color: theme.text }}>{selectedCourse?.building}, {selectedCourse?.room}</p>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: theme.border }}>
                <p className="text-xs" style={{ color: theme.muted }}>Credits</p>
                <p className="font-medium" style={{ color: theme.text }}>{selectedCourse?.credits}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: theme.border }}>
              <Table>
                <TableHeader style={{ background: `${theme.navy}08` }}>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Enrollment ID</TableHead>
                    <TableHead>Enrolled On</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rosterRows.length > 0 ? rosterRows.map((row) => (
                    <TableRow key={row.enrollment_id}>
                      <TableCell>{row.student_id}</TableCell>
                      <TableCell className="font-medium">{row.studentName}</TableCell>
                      <TableCell>{row.enrollment_id}</TableCell>
                      <TableCell>{row.enrolled_on}</TableCell>
                      <TableCell>{row.grade}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center" style={{ color: theme.muted }}>No students enrolled in this course yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function MSURegistrationUIPrototype() {
  const [student, setStudent] = useState(null);
  const [page, setPage] = useState("login");
  const [enrolledIds, setEnrolledIds] = useState(initialEnrollmentIds);
  const [studentEnrollments, setStudentEnrollments] = useState(allEnrollments);

  const enrolledCourses = courseOptions.filter((course) => enrolledIds.includes(course.section_id));

  function handleLogin(foundStudent) {
    setStudent(foundStudent);
    setPage("enrolled");
  }

  function handleEnroll(sectionId) {
    if (!enrolledIds.includes(sectionId)) {
      setEnrolledIds([...enrolledIds, sectionId]);
      setStudentEnrollments([
        ...studentEnrollments,
        {
          enrollment_id: 500 + studentEnrollments.length + 1,
          student_id: student.student_id,
          section_id: sectionId,
          enrolled_on: new Date().toISOString().slice(0, 10),
          grade: "IP",
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg, color: theme.text }}>
      <Header student={student} page={page} setPage={setPage} />
      {!student && <LoginPage onLogin={handleLogin} />}
      {student && page === "enrolled" && <EnrolledCoursesPage enrolledCourses={enrolledCourses} setPage={setPage} />}
      {student && page === "options" && <CourseOptionsPage enrolledIds={enrolledIds} onEnroll={handleEnroll} />}
      {student && page === "courses" && <AllCoursesPage />}
      {student && page === "enrollmentList" && <EnrollmentListPage studentEnrollments={studentEnrollments} />}
      {student && page === "rosters" && <CourseRostersPage studentEnrollments={studentEnrollments} />}
    </div>
  );
}
