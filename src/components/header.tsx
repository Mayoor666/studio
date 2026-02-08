import Link from "next/link";
import { AppLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { getSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function Header() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href={session.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center gap-2 font-semibold">
          <AppLogo className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg tracking-tight">AttendEase</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(session.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.role.charAt(0).toUpperCase() + session.role.slice(1)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form
                action={async () => {
                  "use server";
                  await deleteSession();
                  redirect("/");
                }}
              >
                <DropdownMenuItem asChild>
                   <button type="submit" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
