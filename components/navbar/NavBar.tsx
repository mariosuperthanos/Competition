"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
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
  hasUnread: boolean;
}

function NavBar({ isLoggedIn, hasUnread }: NavBarProps) {
  console.log(hasUnread, "hasUnread from NavBar");
  const navItems = isLoggedIn ? (
    <>
      <Button variant="ghost" asChild className="w-full justify-start bg-white text-black border-b relative">
        <Link href="/notifications">
          Notifications
          {hasUnread && (
            <span className="absolute right-4 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
              !
            </span>
          )}
        </Link>
      </Button>
      <Button variant="ghost" asChild className="w-full justify-start bg-white text-black border-b">
        <Link href="/search-events">Join Event</Link>
      </Button>
      <Button variant="ghost" asChild className="w-full justify-start bg-white text-black border-b">
        <Link href="/create-event">Create Event</Link>
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start bg-white text-black"
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button variant="ghost" asChild className="w-full justify-start bg-white text-black border-b">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button variant="default" asChild className="w-full justify-start bg-white text-black border-b">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-5 bg-white">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-lg pl-4">
          PlanZone
        </Link>

        {/* Mobile menu (hamburger) */}
        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              {navItems}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <Link href="/notifications">
                  <Button variant="ghost" className="border border-black hover:bg-black hover:text-white">
                    Notifications
                  </Button>
                  {hasUnread && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                      !
                    </span>
                  )}
                </Link>
              </div>
              <Link href="/search-events">
                <Button variant="ghost" className="border border-black hover:bg-black hover:text-white">
                  Join Event
                </Button>
              </Link>
              <Link href="/create-event">
                <Button variant="ghost" className="border border-black hover:bg-black hover:text-white">
                  Create Event
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="border border-black hover:bg-black hover:text-white"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="border border-black hover:bg-black hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" className="border border-black hover:bg-black hover:text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;