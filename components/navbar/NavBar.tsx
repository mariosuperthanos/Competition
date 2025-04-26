"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-5">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">ACME Events</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="border border-black hover:bg-black hover:text-white">
            <Link href="/search-events">Join Event</Link>
          </Button>
          <Button variant="ghost" asChild className="border border-black hover:bg-black hover:text-white">
            <Link href="/create-event">Create Event</Link>
          </Button>
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" asChild className="border border-black hover:bg-black hover:text-white">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="default" asChild className="border border-black hover:bg-black hover:text-white">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
