import { error } from "console";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";

export async function POST(request: Request, response: Response) {
  const { message, date, purpose, userId, title } = await request.json();
  try {
    await checkJWT(request);
    await prisma.notification.create({
      data: {
        message,
        date,
        purpose,
        title,
        userId, // e suficient, deoarece ai și userId + relația definită în schema
      },
    });
    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return new NextResponse("Error creating notification", { status: 500 });
  }
}