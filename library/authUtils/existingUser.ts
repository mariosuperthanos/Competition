import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export const existingUser = async (
  inputPassword: string,
  inputEmail: string
) => {
  // console.log(inputEmail);
  // Găsește utilizatorul după email
  const user = await prisma.user.findUnique({
    where: { email: inputEmail },
    select: { email: true, id: true, password: true, name: true },
  });

  if (!user) return undefined; // Dacă email-ul nu există, returnează `undefined`

  // Verifică dacă parola există deja
  const isPasswordUsed = await bcrypt.compare(inputPassword, user.password);

  return isPasswordUsed ? { email: user.email, id: user.id, name:user.name } : undefined;
};
