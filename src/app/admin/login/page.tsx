import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLoginForm } from "./login-form";
import { AppLogo } from "@/components/icons";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
         <Link href="/" className="flex items-center justify-center mb-6 gap-2 text-foreground">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline">AttendEase</span>
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to manage attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
