// import bcrypt from "bcryptjs";
import { hashString } from "../hashing algorithm/hashing";

export const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedPassword = hashString(password);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password")
  }
};