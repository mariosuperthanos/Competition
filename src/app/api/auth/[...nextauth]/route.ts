import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "../../../../../lib/prisma";
import { existingUser } from "../../../../../library/existingUser";
import { error } from "console";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { get } from "http";

export const runtime = "nodejs";

interface CredentialsType {
  email: string;
  password: string;
}

interface Token {
  id: string;
  email: string;
  // Alte proprietăți necesare
}

interface User {
  id: string;
  email: string;
  // Alte proprietăți ale utilizatorului
}

// Extinderea tipului JWT pentru a adăuga id și email
interface CustomJWT extends JWT {
  id: string;
  email: string;
}

// Extinderea tipului Session pentru a include token-ul cu noile câmpuri
interface CustomSession extends Session {
  token: CustomJWT;
}

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 zile
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
    algorithms: ["HS256"], // Specifică algoritmul RS256 pentru semnătura JWT
  },
  cookies: {
    sessionToken: {
      name: "next-authCookie",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 24 * 60 * 60,
      },
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        // console.log("!!!Credentials: ", credentials?.password);
        if (!credentials) {
          throw new Error("Credentials are missing");
        }

        const getUser = await existingUser(
          credentials.password,
          credentials.email
        );
        // console.log("!!!!!!!!!!!!", getUser);
        if (getUser === undefined) {
          throw new Error("Could not log you in!");
        }
        return {
          id: getUser.id,
          email: getUser.email,
        };
      },
    }),
  ],
  pages: {
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Adaugă id-ul utilizatorului în token
        token.email = user.email; // Adaugă email-ul utilizatorului în token
      }
      return token;
    },

    async session({ session, token }) {
      session.token = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const { auth } = NextAuth(authOptions);

// Exportă handler-ul pentru rutele GET și POST
export { handler as GET, handler as POST };
