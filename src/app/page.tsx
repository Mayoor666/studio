import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/icons';
import { ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center text-center mb-12">
        <AppLogo className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-headline">
          Welcome to AttendEase
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          The simple, secure, and efficient way to manage attendance. Please select your role to sign in.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
              <div>
                <CardTitle className="text-2xl font-headline">Admin</CardTitle>
                <CardDescription>Manage attendance sessions and view records.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full" size="lg">
              <Link href="/admin/login">Admin Login <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
          <CardHeader>
             <div className="flex items-center gap-4">
               <User className="w-10 h-10 text-primary" />
                <div>
                  <CardTitle className="text-2xl font-headline">Student</CardTitle>
                  <CardDescription>View your attendance status.</CardDescription>
                </div>
              </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full" size="lg">
              <Link href="/login">Student Login <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
