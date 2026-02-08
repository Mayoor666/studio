'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAttendanceForSession, triggerAttendance } from '@/lib/actions';
import type { Student, AttendanceRecord, AttendanceSession } from '@/lib/definitions';
import { Clock, Loader2, PlayCircle, UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function AttendanceClientWrapper({
  students,
  initialAttendanceRecords,
  initialActiveSession,
}: {
  students: Student[];
  initialAttendanceRecords: AttendanceRecord[];
  initialActiveSession: AttendanceSession | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [records, setRecords] = useState(initialAttendanceRecords);
  const [activeSession, setActiveSession] = useState(initialActiveSession);

  const handleTakeAttendance = () => {
    startTransition(async () => {
      const session = await triggerAttendance();
      setActiveSession(session);
      setRecords([]); // Clear old records
    });
  };

  useEffect(() => {
    if (!activeSession) return;
    
    const interval = setInterval(() => {
        // Check if session is over
        if (Date.now() > activeSession.expiresAt) {
            clearInterval(interval);
            // Optionally fetch final results once more after expiry
            startTransition(async () => {
                const finalRecords = await getAttendanceForSession(activeSession.sessionId);
                setRecords(finalRecords);
                // setActiveSession(null); This might be too abrupt. Let's keep the session visible.
            });
            return;
        }

        // Poll for new records
        startTransition(async () => {
            const newRecords = await getAttendanceForSession(activeSession.sessionId);
            setRecords(newRecords);
        });

    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [activeSession]);


  const getStudentStatus = (studentId: string) => {
    const record = records.find((r) => r.student_id === studentId);
    return record ? record.status : 'Absent';
  };

  const isSessionActive = activeSession && Date.now() < activeSession.expiresAt;

  return (
    <div className="grid gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Live Attendance</CardTitle>
            <CardDescription>
              {isSessionActive ? 'Session is live. Marking students...' : 'Click the button to start a new attendance session.'}
            </CardDescription>
          </div>
          <Button onClick={handleTakeAttendance} disabled={isPending || isSessionActive} size="lg">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
            {isSessionActive ? 'Session Active' : 'Take Attendance'}
          </Button>
        </CardHeader>
        {activeSession && (
            <CardContent>
                <div className="text-sm text-muted-foreground flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <Clock className="h-4 w-4" />
                    <span>
                    Session ID: <strong>{activeSession.sessionId}</strong>.
                    Triggered {formatDistanceToNow(new Date(activeSession.triggeredAt), { addSuffix: true })}.
                    {isSessionActive ? ` Closes in ${formatDistanceToNow(new Date(activeSession.expiresAt))}.` : ' Session closed.'}
                    </span>
                </div>
            </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Results</CardTitle>
          <CardDescription>
            {activeSession ? `Showing results for session ${activeSession.sessionId}` : 'No active session.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const status = activeSession ? getStudentStatus(student.student_id) : 'Absent';
                return (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-medium">{student.student_id}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={status === 'Present' ? 'default' : 'secondary'}
                        className={cn(status === 'Present' ? 'bg-green-600 text-white' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300')}
                      >
                         {status === 'Present' ? <UserCheck className="mr-1 h-3 w-3" /> : <UserX className="mr-1 h-3 w-3" />}
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
