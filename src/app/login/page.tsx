import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentLoginForm } from "./login-form";
import { AppLogo } from "@/components/icons";

export default function StudentLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-6 gap-2 text-foreground">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline">AttendEase</span>
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
            <CardDescription>Enter your credentials to view your attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
