import { NextApiRequest } from "next";
import saveTimezone from "../../../../library/getUserData.ts/saveTimezone";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const result = await saveTimezone();
    return NextResponse.json(
      { data: result},
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 501 });
  }
};
