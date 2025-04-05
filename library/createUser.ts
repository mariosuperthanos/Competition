import prisma from "../lib/prisma";
import { existingUser } from "./existingUser";
import { hashPassword } from "./hashPassword";
// validate + create
export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    console.log(12234);
    // Verifică dacă email-ul există deja
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    console.log(123);
    if (existingEmail) {
      throw new Error("There's already an account with this email!");
    }

    // Verifică dacă parola a fost folosită anterior
    const isPasswordUsed = await existingUser(password, email);
    if (isPasswordUsed) {
      throw new Error("This password has already been used!");
    }

    // Hash-uiește parola
    const hashedPassword = await hashPassword(password);

    // Creează utilizatorul în baza de date
    const newUser = await prisma.user.create({
      data: { name: username, email, password: hashedPassword },
    });

    return { message: "Account created successfully!", user: newUser };
  } catch (err: any) {
    return {
      error: err.message || "An error occurred while creating the account.",
    };
  }
};