'use server';

import { z } from 'zod';
import { getAdminByEmail, getStudentByEmail, createAttendanceSession as createDbAttendanceSession, getActiveAttendanceSession as getDbActiveAttendanceSession, markStudentAsPresent as dbMarkStudentAsPresent, getAttendanceForSession as dbGetAttendanceForSession } from './data';
import { compare } from 'bcryptjs';
import { createSession, deleteSession, getSession } from './auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const StudentLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  studentId: z.string().min(1, { message: "Student ID is required." }),
});

const AdminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  adminId: z.string().min(1, { message: "Admin ID is required." }),
});

type FormState = {
  message: string;
  success: boolean;
};

export async function authenticateStudent(_: FormState, formData: FormData): Promise<FormState> {
  try {
    const parsed = StudentLoginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
      return { message: parsed.error.errors[0].message, success: false };
    }

    const { email, studentId } = parsed.data;
    const student = await getStudentByEmail(email);

    if (!student || student.student_id !== studentId) {
      return { message: "Invalid email or student ID.", success: false };
    }

    await createSession(student.student_id, student.email, 'student');
  } catch (error) {
    return { message: "An unexpected error occurred. Please try again.", success: false };
  }
  redirect('/student/dashboard');
}

export async function authenticateAdmin(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const parsed = AdminLoginSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!parsed.success) {
            return { message: parsed.error.errors[0].message, success: false };
        }

        const { email, password, adminId } = parsed.data;
        const admin = await getAdminByEmail(email);
        
        if (!admin || admin.admin_id !== adminId) {
            return { message: "Invalid credentials.", success: false };
        }

        const passwordsMatch = await compare(password, admin.password_hash);
        if (!passwordsMatch) {
            return { message: "Invalid credentials.", success: false };
        }
        
        await createSession(admin.admin_id, admin.email, 'admin');

    } catch (error) {
        return { message: "An unexpected error occurred. Please try again.", success: false };
    }
    redirect('/admin/dashboard');
}

export async function triggerAttendance() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  const attendanceSession = await createDbAttendanceSession();
  revalidatePath('/admin/dashboard');
  revalidatePath('/student/dashboard');
  return attendanceSession;
}

export async function getActiveAttendanceSession() {
    return getDbActiveAttendanceSession();
}

export async function getAttendanceForSession(sessionId: string) {
    return dbGetAttendanceForSession(sessionId);
}

export async function getStudentAttendanceStatus() {
    const session = await getSession();
    if (session?.role !== 'student') {
        throw new Error('Unauthorized');
    }

    const activeSession = await getDbActiveAttendanceSession();
    if (!activeSession) {
        return { status: 'Inactive' };
    }

    // Mark as present if within the window
    await dbMarkStudentAsPresent(session.userId, activeSession.sessionId);
    
    const allAttendance = await dbGetAttendanceForSession(activeSession.sessionId);
    const myRecord = allAttendance.find(rec => rec.student_id === session.userId);

    if (myRecord) {
        return { status: 'Present', session: activeSession };
    }

    return { status: 'Absent', session: activeSession };
}
