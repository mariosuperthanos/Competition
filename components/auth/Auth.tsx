"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react"
import { loginUtil } from "../../library/authUtils/loginUtil"
import { z } from "zod"
import { formSchema } from "../../library/schemas/create-event"
import axios from "axios"

interface AuthPageProps {
  mode: "signUp" | "login"
}

type FormValues = {
  name?: string
  email: string
  password: string
  confirmPassword?: string
}

export default function AuthForm({ mode = "login" }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null)

  const isSignUp = mode === "signUp"

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")

  async function signUpHandler(values: FormValues) {
    // API_URL for creating a user without creating a JWT token
    const API_URL = `${window.location.origin}/api/createUserCS`;

    // Send request to create a new user
    const { data: newUserResponse } = await axios.post(API_URL, {
      username: values.name,
      password: values.password,
      email: values.email,
    });

    // error if a user already exists
    if (newUserResponse?.message === "The name and email have to be unique!") {
      throw new Error(newUserResponse.error);
    }

    // attempt to log in after successful user creation
    // loginUtil is client side function
    const loginUserResponse = await loginUtil(values.email, values.password);

    if (loginUserResponse?.message !== "Login successful") {
      throw new Error("Something went wrong. Try to again!");
    }

    window.location.href = "/tags"; // Redirect to dashboard after successful login
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      if (!isSignUp) {
        await loginUtil(data.email, data.password);
      } else {
        await signUpHandler(data);
      }
    } catch (error) {
      if (!isSignUp) {
        setFeedback("Email or password is incorrect. Please try again.");
      } else {
        setFeedback("Name and email must be unique. Please use a different name or email address.");
      }  
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-blue-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-lg bg-white/80 border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {isSignUp ? "Join us and start your journey today" : "Sign in to continue to your account"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className={`pl-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                      {...register("name", {
                        required: isSignUp ? "Name is required" : false,
                      })}
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                      {...register("confirmPassword", {
                        required: isSignUp ? "Please confirm your password" : false,
                        validate: (value) => !isSignUp || !value || value === password || "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                </div>
              )}
              <p className="text-sm text-red-500 mt-2">{feedback}</p>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                  </div>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <Link
                  href={isSignUp ? "/auth/login" : "/auth/signup"}
                  className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
