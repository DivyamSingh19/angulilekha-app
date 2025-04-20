"use client";

import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

interface LoginResponse {
  email?: string;
  name?: string;
  user?: {
    email: string;
    name?: string;
  };
  // Add other possible response fields
  message?: string;
  success?: boolean;
  token?: string;
}

interface ApiError {
  message: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!apiUrl) {
        throw new Error("API URL is not defined. Please add it to your .env.local file as NEXT_PUBLIC_API_URL");
      }
      
      console.log("Submitting login to:", `${apiUrl}/api/auth/login-user`);
      
      const response = await axios.post<LoginResponse>(`${apiUrl}/api/auth/login-user`, {
        email,
        password
      }); 
      
      console.log("Login response:", response.data);
      
      // More flexible response handling
      if (response.data) {
        // Try to extract email from different possible response structures
        const userEmail = response.data.email || response.data.user?.email || '';
        const userName = response.data.name || response.data.user?.name || '';
        
        if (userEmail) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('userEmail', userEmail);
            if (userName) {
              localStorage.setItem('userName', userName);
            }
          }
          
          setSuccess(true);
          
          // Redirect to home page after a brief delay to show success message
          setTimeout(() => router.push('/'), 1500);
        } else if (response.data.success || response.data.message?.toLowerCase().includes('success') || response.data.token) {
          // If we have a success indicator but no user details
          setSuccess(true);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('userEmail', email);
          }
          
          setTimeout(() => router.push('/'), 1500);
        } else {
          // Response seems valid but doesn't match expected format
          console.warn("Unexpected but successful response format:", response.data);
          setSuccess(true);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('userEmail', email);
          }
          
          setTimeout(() => router.push('/'), 1500);
        }
      } else {
        throw new Error('Empty response from server');
      }
    } catch (err) {
      console.error("Login error:", err);
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message || 
        axiosError.message || 
        'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Decorative background elements with blur */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Glass effect card */}
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Login</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border border-red-100">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border border-green-100">
              <AlertDescription>Login successful!</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
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
                <Label htmlFor="password" className="text-gray-700">Password</Label>
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
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>

      {/* Add a style block for custom animation */}
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

export default LoginPage;