import type { Admin, Student, AttendanceRecord, AttendanceSession } from '@/lib/definitions';

// In-memory store
const MOCK_DB = {
  admins: [
    {
      admin_id: 'admin001',
      email: 'admin@attendease.com',
      // Hash for "password123"
      password_hash: '$2a$10$w.p.L9gxt7i1gJzDoL3oZeQ7q.3xRk/cW6D2U9.LdM2lP25O3/0u2',
    },
  ] as Admin[],
  students: [
    { student_id: 'S001', email: 'alice@example.com' },
    { student_id: 'S002', email: 'bob@example.com' },
    { student_id: 'S003', email: 'charlie@example.com' },
    { student_id: 'S004', email: 'diana@example.com' },
  ] as Student[],
  attendance: [] as AttendanceRecord[],
};

// In-memory session state
let activeAttendanceSession: AttendanceSession | null = null;
const ATTENDANCE_WINDOW_MS = 30000; // 30 seconds

// --- Admin Data ---
export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  return MOCK_DB.admins.find((admin) => admin.email === email);
}

// --- Student Data ---
export async function getStudentByEmail(email: string): Promise<Student | undefined> {
  return MOCK_DB.students.find((student) => student.email === email);
}

export async function getAllStudents(): Promise<Student[]> {
  return MOCK_DB.students;
}

// --- Attendance Data & Logic ---
export async function createAttendanceSession(): Promise<AttendanceSession> {
  const now = Date.now();
  activeAttendanceSession = {
    sessionId: `SESS-${now}`,
    triggeredAt: now,
    expiresAt: now + ATTENDANCE_WINDOW_MS,
  };
  return activeAttendanceSession;
}

export async function getActiveAttendanceSession(): Promise<AttendanceSession | null> {
  if (activeAttendanceSession && Date.now() > activeAttendanceSession.expiresAt) {
    activeAttendanceSession = null;
  }
  return activeAttendanceSession;
}

export async function markStudentAsPresent(studentId: string, sessionId: string): Promise<AttendanceRecord> {
  const existingRecord = MOCK_DB.attendance.find(
    (rec) => rec.student_id === studentId && rec.session_id === sessionId
  );

  if (existingRecord) {
    return existingRecord;
  }

  const newRecord: AttendanceRecord = {
    attendance_id: `ATT-${Date.now()}-${Math.random()}`,
    student_id: studentId,
    session_id: sessionId,
    status: 'Present',
    timestamp: new Date().toISOString(),
  };
  MOCK_DB.attendance.push(newRecord);
  return newRecord;
}

export async function getAttendanceForSession(sessionId: string): Promise<AttendanceRecord[]> {
  return MOCK_DB.attendance.filter((rec) => rec.session_id === sessionId);
}
