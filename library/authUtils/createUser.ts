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
    // verify if the email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new Error("There's already an account with this email!");
    }

    // verify if the password already exists
    const isPasswordUsed = await existingUser(password, email);
    if (isPasswordUsed) {
      throw new Error("This password has already been used!");
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    // get user timezone
    const userTimezone = await saveTimezone();

    // add the user in the DB
    const newUser = await prisma.user.create({
      data: { name: username, email, password: hashedPassword, timezone: userTimezone?.timezone },
    });

    return { message: "Account created successfully!", user: newUser };
  } catch (err: any) {
    return {
      error: err.message || "An error occurred while creating the account.",
    };
  }
};