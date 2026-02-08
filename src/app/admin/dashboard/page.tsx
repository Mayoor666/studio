import { Header } from "@/components/header";
import { getActiveAttendanceSession, getAttendanceForSession } from "@/lib/actions";
import { getAllStudents } from "@/lib/data";
import { AttendanceClientWrapper } from "./attendance-client-wrapper";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | AttendEase',
};

export default async function AdminDashboardPage() {
  const [students, activeSession] = await Promise.all([
    getAllStudents(),
    getActiveAttendanceSession(),
  ]);

  const attendanceRecords = activeSession
    ? await getAttendanceForSession(activeSession.sessionId)
    : [];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl font-headline">Admin Dashboard</h1>
        </div>
        <AttendanceClientWrapper
          students={students}
          initialAttendanceRecords={attendanceRecords}
          initialActiveSession={activeSession}
        />
      </main>
    </div>
  );
}
