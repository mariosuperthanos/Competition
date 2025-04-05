import { signIn } from "next-auth/react";

export async function loginUtil(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    if (result?.error) {
      throw new Error("Something went wrong!");
    }
    return { success: true, message: "Login successful" };
  } catch (err: any) {
    return {
      message: err.message
    };
  }
}