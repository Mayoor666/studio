import { Header } from "@/components/header";
import { getSession } from "@/lib/auth";
import { AttendanceStatus } from "./attendance-status";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Dashboard | AttendEase',
};

export default async function StudentDashboardPage() {
  const session = await getSession();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
           <div className="text-center mb-8">
             <h1 className="font-semibold text-2xl md:text-3xl font-headline">Welcome, {session?.email}</h1>
             <p className="text-muted-foreground mt-2">Your attendance status for the current session is shown below.</p>
           </div>
          <AttendanceStatus />
        </div>
      </main>
    </div>
  );
}
