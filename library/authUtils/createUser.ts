import prisma from "../../lib/prisma";
import saveTimezone from "../getUserData.ts/saveTimezone";
import { existingUser } from "./existingUser";
import { hashPassword } from "./hashPassword";

// verify if the email and password are unused and creat a new user
export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    // Check if email already exists
    const [existingEmail] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      // existingUser(password, email),
    ]);

    if (existingEmail) {
      throw new Error("There's already an account with this email!");
    }

    // if (isPasswordUsed) {
    //   throw new Error("This password has already been used!");
    // }

    // Do these in parallel
    const [hashedPassword, userTimezone] = await Promise.all([
      hashPassword(password),
      saveTimezone(),
    ]);

    // add the new user to the database
    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
        timezone: userTimezone?.timezone ?? null,
      },
    });

    return { message: "Account created successfully!", user: newUser };
  } catch (err: any) {
    return {
      error: err.message || "An error occurred while creating the account.",
    };
  }
};