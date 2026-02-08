'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticateAdmin } from '@/lib/actions';
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

export function AdminLoginForm() {
  const [state, dispatch] = useFormState(authenticateAdmin, { message: '', success: false });
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
        <Input id="email" name="email" type="email" placeholder="admin@attendease.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminId">Admin ID</Label>
        <Input id="adminId" name="adminId" type="text" placeholder="admin001" required />
      </div>
      <LoginButton />
    </form>
  );
}
