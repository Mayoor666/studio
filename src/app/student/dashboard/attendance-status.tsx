'use client';

import { useState, useEffect } from 'react';
import { getStudentAttendanceStatus } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'Loading' | 'Present' | 'Absent' | 'Inactive';

export function AttendanceStatus() {
  const [status, setStatus] = useState<Status>('Loading');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getStudentAttendanceStatus();
        setStatus(result.status as Status);
      } catch (error) {
        console.error("Failed to fetch attendance status", error);
        setStatus('Inactive'); // Default to inactive on error
      }
    };

    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusContent = () => {
    switch (status) {
      case 'Loading':
        return {
          icon: <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />,
          title: 'Checking Status...',
          description: 'Please wait while we check for an active attendance session.',
          cardClass: 'bg-card',
        };
      case 'Present':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'You are Present!',
          description: 'Your attendance has been marked for the current session. Well done!',
          cardClass: 'bg-green-50 dark:bg-green-900/20 border-green-500',
        };
      case 'Absent':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'You are Marked Absent',
          description: 'The attendance window for the current session has closed, and you were not marked present.',
          cardClass: 'bg-red-50 dark:bg-red-900/20 border-red-500',
        };
      case 'Inactive':
      default:
        return {
          icon: <Hourglass className="h-16 w-16 text-muted-foreground" />,
          title: 'No Active Session',
          description: 'There is no active attendance session right now. Please wait for the admin to start one.',
          cardClass: 'bg-card',
        };
    }
  };

  const { icon, title, description, cardClass } = getStatusContent();

  return (
    <Card className={cn("w-full transition-all duration-300", cardClass)}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <CardTitle className="text-3xl font-bold font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
