// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect("/");

  // Setează cookie-urile ca fiind expirate pentru a le șterge
  response.cookies.set("next-auth.callback-url", "", {
    path: "/",
    maxAge: 0, // Expiră cookie-ul imediat
  });

  response.cookies.set("next-auth.csrf-token", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("next-auth.session-token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}