import { z } from "zod";

// schema for singup/login fields
const validationObject = (mode: "login" | "signUp") => {
  return z.object({
    email: z
      .string()
      .min(2, { message: "Email must be at least 2 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    ...(mode === "signUp" && {
      username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters." }),
    }),
  });
};

export default validationObject;