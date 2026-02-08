export type Admin = {
  admin_id: string;
  email: string;
  password_hash: string;
};

export type Student = {
  student_id: string;
  email: string;
};

export type AttendanceRecord = {
  attendance_id: string;
  student_id: string;
  status: 'Present' | 'Absent';
  timestamp: string;
  session_id: string;
};

export type SessionPayload = {
  userId: string;
  email: string;
  role: 'admin' | 'student';
  expires: string;
};

export type AttendanceSession = {
  sessionId: string;
  triggeredAt: number;
  expiresAt: number;
};
