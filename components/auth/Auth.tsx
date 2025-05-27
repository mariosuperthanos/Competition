"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import validationObject from "../../library/schemas/auth"
import axios from "axios"
import { loginUtil } from "../../library/authUtils/loginUtil"
import image from "./../../photos/image.png"
import { useRouter } from "next/navigation";
import { set } from "date-fns"
import saveTimezone from "../../library/getUserData.ts/saveTimezone"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const [feedback, setFeedback] = useState<string>("");
  // create a validation schema based on mode
  const formSchema = validationObject(props.mode);
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
      const API_URL = `${window.location.origin}/api/createUserCS`;

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
        throw new Error("Something went wrong. Try to again!");
      }

      window.location.href = "/tags"; // Redirect to dashboard after successful login
    } catch (err: any) {
      setFeedback(
        err?.response?.data?.message || err.message || "An error occurred."
      );
    }
  }

  // it calls the client side loggin function
  async function loginHandler(values: z.infer<typeof formSchema>) {
    const response = await loginUtil(values.email, values.password);
    console.log(response.message);
    if (response?.message == "Login successful") {
      window.location.href = "/";  // Redirect to dashboard after successful login
    } else {
      setFeedback("Something went wrong. Try to login again!");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 bg-white">
          <Form {...form}>
            <form onSubmit={props.mode == "signUp" ? form.handleSubmit(signUpHandler) : form.handleSubmit(loginHandler)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">Login to your Acme Inc account</p>
                </div>

                {props.mode === "signUp" && (<FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />)}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} value={field.value as string} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-black text-white">
                  {props.mode === "signUp" ? "Sign Up" : "Login"}
                </Button>
                {feedback !== "" && <p className="text-red-500 text-center">{feedback}</p>}

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>

                <div className="w-full">
                  <Button variant="outline" className="w-full" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                </div>
                {props.mode === "login" && (
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="/auth/signup" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                )}
                {props.mode === "signUp" && (
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/auth/login" className="underline underline-offset-4">
                      Login
                    </a>
                  </div>
                )}
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={image.src}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[1.1]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

export default AuthForm;
