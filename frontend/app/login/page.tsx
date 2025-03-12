'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AttendlyLogo from '../AttendlyLogo';
import { Eye, EyeOff } from 'lucide-react';

interface LoginValues {
  username: string;
  password: string;
}

export default function LoginPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Initialize react-hook-form
  const form = useForm<LoginValues>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Handle Login
  const handleLogin = async (values: LoginValues) => {
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', values);

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);
        localStorage.setItem('role', user.role);

        router.push('/dashboard');
      } else {
        setError('Invalid server response');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Logo */}
        <div className="flex justify-center mb-10 mt-10">
          <AttendlyLogo size="lg" />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Attendly
        </h2>

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="px-8 py-6 space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your username" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-gradient-to-br from-sky-500 to-teal-500 font-medium">
              Login
            </Button>
          </form>
        </Form>

        {/* Sign-Up Link */}
        <p className="text-center mb-5 text-sm">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
