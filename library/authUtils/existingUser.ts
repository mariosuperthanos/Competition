import prisma from "../../lib/prisma";
// import bcrypt from "bcryptjs";
import { decryptString } from "../hashing algorithm/hashing";

export const existingUser = async (
  inputPassword: string,
  inputEmail: string
) => {
  // console.log(inputEmail);
  // find the user in DB via email
  const user = await prisma.user.findUnique({
    where: { email: inputEmail },
    select: { email: true, id: true, password: true, name: true },
  });

  if (!user) return undefined;

  // compare the passwords
  const candidatePassword = inputPassword;
  const decryptedPassword = decryptString(user.password);
  const isPasswordUsed = decryptedPassword === candidatePassword;
  // const isPasswordUsed = await bcrypt.compare(inputPassword, user.password);

  return isPasswordUsed ? { email: user.email, id: user.id, name: user.name } : undefined;
};
