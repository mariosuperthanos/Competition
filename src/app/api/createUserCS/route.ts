import { NextResponse } from "next/server";
import { createUser } from "../../../../library/createUser";

// this function create an user without returning JWT token
export async function POST(req: Request) {
  try {
    const { password, email, username } = await req.json();
    console.log("Eminem");
    
    const createNewUser = await createUser(username, email, password);
    
    if (createNewUser?.error) {
      throw new Error(createNewUser.error);
    }

    return NextResponse.json({ message: createNewUser.message }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 501 });
  }
}