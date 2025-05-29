import { signIn } from "next-auth/react";

export async function loginUtil(email: string, password: string) {
  const result = await signIn("credentials", {
    redirect: false,
    email: email,
    password: password,
  });
  if (result?.error) {
    throw new Error("Something went wrong!");
  }
  return { success: true, message: "Login successful" };
}