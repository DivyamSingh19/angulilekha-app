"use client";

import React, { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegisterResponse {
  email?: string;
  name?: string;
  user?: {
    email: string;
    name: string;
  };

  message?: string;
  success?: boolean;
  token?: string;
}

interface ApiError {
  message: string;
}

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if((password.length)<8){
      setError("Password too small");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!apiUrl) {
        throw new Error(
          "API URL is not defined. Please add it to your .env.local file as NEXT_PUBLIC_API_URL"
        );
      }

      console.log(
        "Submitting registration to:",
        `${apiUrl}/api/auth/register-user`
      );

      const response = await axios.post<RegisterResponse>(
        `${apiUrl}/api/auth/register-user`,
        {
          name,
          email,
          password,
        }
      );

      console.log("Registration response:", response.data);

      if (response.data) {
        const userEmail =
          response.data.email || response.data.user?.email || "";
        const userName = response.data.name || response.data.user?.name || name;

        if (userEmail) {
          if (typeof window !== "undefined") {
            localStorage.setItem("userEmail", userEmail);
            localStorage.setItem("userName", userName);
          }

          setSuccess(true);

          setTimeout(() => router.push("/"), 1500);
        } else if (
          response.data.success ||
          response.data.message?.toLowerCase().includes("success")
        ) {
          setSuccess(true);

          if (typeof window !== "undefined") {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", name);
          }
          
          setTimeout(() => router.push('/ '), 1500);
        } else {
           
          console.warn(
            "Unexpected but successful response format:",
            response.data
          );
          setSuccess(true);

          if (typeof window !== "undefined") {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", name);
          }
          
          setTimeout(() => router.push('/'), 1500);
        }
      } else {
        throw new Error("Empty response from server");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Sign up to get started with our service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-50 border border-red-100"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border border-green-100">
              <AlertDescription>Registration successful!</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/60 backdrop-blur-sm focus:bg-white/80 transition-all"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/60 backdrop-blur-sm focus:bg-white/80 transition-all"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/60 backdrop-blur-sm focus:bg-white/80 transition-all"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/60 backdrop-blur-sm focus:bg-white/80 transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
