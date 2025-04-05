import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  try {
    const saltRounds = 12; // Nivelul de securitate
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);  // Logare pentru debugging
    throw new Error("Failed to hash password");  // Aruncă eroarea pentru a fi gestionată în altă parte
  }
};