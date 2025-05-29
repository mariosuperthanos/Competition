import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const response = NextResponse.json({ JWT: "" });

  // Șterge cookie-urile relevante pentru logout
  response.cookies.set("next-auth.session-token", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("next-auth.csrf-token", "", {
    path: "/",
    maxAge: 0,
  });
  
  response.cookies.set("next-auth.callback-url", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
