'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticateStudent } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
      Sign In
    </Button>
  );
}

export function StudentLoginForm() {
  const [state, dispatch] = useFormState(authenticateStudent, { message: '', success: false });
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="student@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input id="studentId" name="studentId" type="text" placeholder="S001" required />
      </div>
      <LoginButton />
    </form>
  );
}
