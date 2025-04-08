"use client";

import cn from "clsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
// import { signIn, useSession } from "next-auth/react";
// import { createUser } from "../../library/authUtils/createUser";
import { loginUtil } from "../../library/authUtils/loginUtil";
// schema for loggin fields
import validationObject from "../../library/schemas/auth";

interface AuthFormProps {
  mode: "signUp" | "login";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  // the error/success text
  const [feedback, setFeedback] = useState<string>("");
  // create a validation schema based on mode
  const formSchema = validationObject(mode);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // dummy data
    defaultValues: {
      email: "gasds@gag.com",
      username: "david",
      password: "ggsdgdsgsgsdgs",
    },
  });

  async function signUpHandler(values: z.infer<typeof formSchema>) {
    try {
      // API_URL for creating a user without creating a JWT token
      const API_URL = "http://localhost:3000/api/createUserCS";

      // Send request to create a new user
      const { data: newUserResponse } = await axios.post(API_URL, {
        username: values.username,
        password: values.password,
        email: values.email,
      });

      // error if a user already exists
      if (newUserResponse?.error) {
        throw new Error(newUserResponse.error);
      }

      // attempt to log in after successful user creation
      // loginUtil is client side function
      const loginUserResponse = await loginUtil(values.email, values.password);

      if (loginUserResponse?.message !== "Login successful") {
        throw new Error("Something went wrong. Try to login!");
      }

      setFeedback("OK");
    } catch (err: any) {
      setFeedback(
        err?.response?.data?.message || err.message || "An error occurred."
      );
    }
  }

  // it calls the client side loggin function
  async function loginHandler(values: z.infer<typeof formSchema>) {
    const response = await loginUtil(values.email, values.password);

    setFeedback(response.message);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          mode === "signUp"
            ? form.handleSubmit(signUpHandler)
            : form.handleSubmit(loginHandler)
        }
        className="max-w-md w-full bg-white p-6 rounded-lg shadow-md"
      >
        {mode === "signUp" && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            // inline style have priority
            <FormItem
              className="space-y-2 mb-6"
              style={{ marginBottom: "1.25rem" }}
            >
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {feedback !== "" && <p>{feedback}</p>}
        <Button type="submit" className="mt-6">
          Submit
        </Button>
        {mode === "signUp" ? (
          <Link href="/auth/login">Already have an account?</Link>
        ) : (
          <Link href="/auth/signup">Create new account</Link>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
