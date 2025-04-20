import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "../../../../../lib/prisma";
import { existingUser } from "../../../../../library/authUtils/existingUser";
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
}

interface User {
  id: string;
  email: string;
}

interface CustomJWT extends JWT {
  id: string;
  email: string;
}

interface CustomSession extends Session {
  token: CustomJWT;
}

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // encryption ket
    encryption: true,
    algorithms: ["HS256"], // JWT algorithm
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
      // this is a login function used only by UI, not API auth
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        // console.log("!!!Credentials: ", credentials?.password);
        if (!credentials) {
          throw new Error("Credentials are missing");
        }
        // verify if the user exists in DB
        const getUser = await existingUser(
          credentials.password,
          credentials.email
        );

        if (getUser === undefined) {
          throw new Error("Could not log you in!");
        }

        console.log("Get user is", getUser);
        return {
          name: getUser.name,
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
      // store data in JWT token
      if (user) {
        token.name = user.name;
        token.id = user.id;
        token.email = user.email;
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
