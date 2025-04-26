import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { error } from "console";
import prisma from "../../lib/prisma";

const checkJWT = async () => {
  // validate the cookie by using next auth server side function
  const cookie = await getServerSession(authOptions);
  console.log(cookie);

  if (!cookie) {
    throw new Error("You are not logged in.");
  }

  const id = cookie.token.id;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  console.log(user);

  if (!user) {
    throw new Error("You are not logged in.");
  }

  return cookie.token.id;
};

export default checkJWT;
