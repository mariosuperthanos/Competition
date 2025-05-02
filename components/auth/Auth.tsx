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
        throw new Error("Something went wrong. Try to again!");
      }

      window.location.href = "/"; // Redirect to dashboard after successful login
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




// return (
//   <div className={cn("flex flex-col gap-6")}>
//     <Card className="overflow-hidden">
//       <CardContent className="grid p-0 md:grid-cols-2">
//         <form className="p-6 md:p-8">
//           <div className="flex flex-col gap-6">
//             <div className="flex flex-col items-center text-center">
//               <h1 className="text-2xl font-bold">Welcome back</h1>
//               <p className="text-balance text-muted-foreground">Login to your Acme Inc account</p>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="m@example.com" required />
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Password</Label>
//                 <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
//                   Forgot your password?
//                 </a>
//               </div>
//               <Input id="password" type="password" required />
//             </div>
//             <Button type="submit" className="w-full bg-black text-white">
//               Login
//             </Button>
//             <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//               <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
//             </div>
//             <div className="grid grid-cols-3 gap-4">
//               <Button variant="outline" className="w-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path
//                     d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
//                     fill="currentColor"
//                   />
//                 </svg>
//                 <span className="sr-only">Login with Apple</span>
//               </Button>
//               <Button variant="outline" className="w-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path
//                     d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
//                     fill="currentColor"
//                   />
//                 </svg>
//                 <span className="sr-only">Login with Google</span>
//               </Button>
//               <Button variant="outline" className="w-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path
//                     d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
//                     fill="currentColor"
//                   />
//                 </svg>
//                 <span className="sr-only">Login with Meta</span>
//               </Button>
//             </div>
//             <div className="text-center text-sm">
//               Don&apos;t have an account?{" "}
//               <a href="#" className="underline underline-offset-4">
//                 Sign up
//               </a>
//             </div>
//           </div>
//         </form>
//         <div className="relative hidden bg-muted md:block">
//           <Image
//             src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
//             alt="Image"
//             fill
//             className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
//           />
//         </div>
//       </CardContent>
//     </Card>
//     <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
//       By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
//     </div>
//   </div>
// )
// };






{/* <Form {...form}>
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
                  <Input
                    className="border-2 border-gray-300" // Lighter gray border
                    placeholder="shadcn"
                    {...field}
                  />
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
                <Input
                  className="border-2 border-gray-300" // Lighter gray border
                  placeholder="shadcn"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem
              className="space-y-2 mb-6"
              style={{ marginBottom: "1.25rem" }}
            >
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="border-2 border-gray-300" // Lighter gray border
                  placeholder="shadcn"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {feedback !== "" && <p>{feedback}</p>}
        <Button type="submit" className="mt-6 bg-black text-white">
          Submit
        </Button>
        {mode === "signUp" ? (
          <Link href="/auth/login" className="ml-3">Already have an account?</Link>
        ) : (
          <Link href="/auth/signup" className="ml-3">Create new account</Link>
        )}
      </form>
    </Form>
  ); */}





















//   "use client";

// import cn from "clsx";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useState } from "react";
// import Link from "next/link";
// // import { signIn, useSession } from "next-auth/react";
// // import { createUser } from "../../library/authUtils/createUser";
// import { loginUtil } from "../../library/authUtils/loginUtil";
// // schema for loggin fields
// import validationObject from "../../library/schemas/auth";
// import Image from "next/image";

// interface AuthFormProps {
//   mode: "signUp" | "login";
// }

// const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
//   // the error/success text
//   const [feedback, setFeedback] = useState<string>("");
//   // create a validation schema based on mode
//   const formSchema = validationObject(mode);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     // dummy data
//     defaultValues: {
//       email: "gasds@gag.com",
//       username: "david",
//       password: "ggsdgdsgsgsdgs",
//     },
//   });

//   async function signUpHandler(values: z.infer<typeof formSchema>) {
//     try {
//       // API_URL for creating a user without creating a JWT token
//       const API_URL = "http://localhost:3000/api/createUserCS";

//       // Send request to create a new user
//       const { data: newUserResponse } = await axios.post(API_URL, {
//         username: values.username,
//         password: values.password,
//         email: values.email,
//       });

//       // error if a user already exists
//       if (newUserResponse?.error) {
//         throw new Error(newUserResponse.error);
//       }

//       // attempt to log in after successful user creation
//       // loginUtil is client side function
//       const loginUserResponse = await loginUtil(values.email, values.password);

//       if (loginUserResponse?.message !== "Login successful") {
//         throw new Error("Something went wrong. Try to login!");
//       }

//       setFeedback("OK");
//     } catch (err: any) {
//       setFeedback(
//         err?.response?.data?.message || err.message || "An error occurred."
//       );
//     }
//   }

//   // it calls the client side loggin function
//   async function loginHandler(values: z.infer<typeof formSchema>) {
//     const response = await loginUtil(values.email, values.password);

//     setFeedback(response.message);
//   }

//   return (
//     <div className={cn("flex flex-col gap-6")}>
//       <Card className="overflow-hidden">
//         <CardContent className="grid p-0 md:grid-cols-2">
//           <Form {...form}>
//             <form className="p-6 md:p-8" onSubmit={form.handleSubmit(mode === 'signUp' ? signUpHandler : loginHandler)}>
//               <div className="flex flex-col gap-6">
//                 <div className="flex flex-col items-center text-center">
//                   <h1 className="text-2xl font-bold">Welcome back</h1>
//                   <p className="text-balance text-muted-foreground">Login to your Acme Inc account</p>
//                 </div>
//                 <div className="grid gap-2">
//                   <FormField
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             id="email"
//                             type="email"
//                             placeholder="m@example.com"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <div className="flex items-center">
//                     <FormField
//                       name="password"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Password</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               id="password"
//                               type="password"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
//                       Forgot your password?
//                     </a>
//                   </div>
//                 </div>
//                 <Button type="submit" className="w-full bg-black text-white">
//                   Login
//                 </Button>
//                 <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//                   <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   {/* Other social login buttons here */}
//                 </div>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };