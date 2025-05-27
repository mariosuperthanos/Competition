import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { error } from "console";
import prisma from "../../lib/prisma";

const checkJWT = async (req = null) => {
  // req este diferit de null doar în cazul request-urilor POST, PUT, DELETE etc.
  if (req !== null) {
    // Verifică existența tokenului CSRF trimis în header, generat cu ajutorul librăriei NextAuth
    const csrfTokenFromHeader = req.headers.get("csrf-token");
    console.log("CSRF Token from header:", csrfTokenFromHeader);

    if (!csrfTokenFromHeader) {
      throw new Error("CSRF token missing");
    }
  }

  // Verifică dacă JWT-ul din cookie este valid folosind NextAuth
  const cookie = await getServerSession(authOptions);
  console.log(cookie);

  if (!cookie) {
    throw new Error("You are not logged in.");
  }

  const id = cookie.token.id;

  // Caută utilizatorul în baza de date pe baza ID-ului obținut din cookie
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
