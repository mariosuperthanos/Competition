"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

interface NavBarProps {
  isLoggedIn: boolean;
}

function NavBar({ isLogedIn }: NavBarProps) {
  console.log(isLogedIn, "isLoggedIn from NavBar");


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-5 bg-white">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">ACME Events</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="border border-black hover:bg-black hover:text-white">
            <Link href="/notifications">Notifications</Link>
          </Button>
          <Button variant="ghost" asChild className="border border-black hover:bg-black hover:text-white">
            <Link href="/search-events">Join Event</Link>
          </Button>
          <Button variant="ghost" asChild className="border border-black hover:bg-black hover:text-white">
            <Link href="/create-event">Create Event</Link>
          </Button>
          {isLogedIn == null ? (
            <>
              <Button variant="ghost" asChild className="border border-black hover:bg-black hover:text-white">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="default" asChild className="border border-black hover:bg-black hover:text-white">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              asChild
              className="border border-black hover:bg-black hover:text-white"
              onClick={() => signOut()}
            >
              <Link href="/">Logout</Link>
            </Button>
          )}
        </nav>
      </div>
    </header >
  );
}

export default NavBar;
