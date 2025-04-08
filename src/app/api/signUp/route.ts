import { NextResponse } from "next/server";
import { createUser } from "../../../../library/authUtils/createUser";
import axios from "axios";

// export const GET = async () => {
//   try {
//     const createUser = await prisma.user.create({
//       data: {
//         name: "Dan1",
//         email: "da1n@gmail.com",
//         password: "hfdh1sdggds"
//       }
//     })
//     return NextResponse.json({ data: createUser }, { status: 200 });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     return NextResponse.json(
//       { err },
//       { status: 501 }
//     );
//   }
// }

// create account on server side
export const POST = async (req: Request | null) => {
  try {
    const { username, password, email } = await req.json();

    const userResponse = await createUser(username, email, password);

    if (userResponse.error) {
      return NextResponse.json({ error: userResponse.error }, { status: 400 });
    }


    // signIn from nextAuth is not allowed in server side
    const loginToken = await axios.post("http://localhost:3000/api/login", {
      email,
      password,
      json: true,
    });

    // console.log(loginToken.data.JWT);

    return NextResponse.json(
      { JWT: loginToken.data.JWT, message: "Account created successfully!" },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 501 });
  }
};
