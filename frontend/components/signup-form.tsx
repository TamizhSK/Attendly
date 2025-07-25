'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from "@/hooks/use-toast"; 
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Eye, EyeOff, Check, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  email: z.string().email('Enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .regex(/(?=.*[a-z])/, 'Must include a lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Must include an uppercase letter')
    .regex(/(?=.*\d)/, 'Must include a number')
    .regex(/(?=.*[!@#$%^&*])/, 'Must include a special character'),
  confirmPassword: z.string(),
  role: z.enum(['faculty', 'admin'], { required_error: 'Please select a role' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
    mode: 'onChange'
  });

  const { watch } = form;
  const watchPassword = watch('password');
  const watchConfirmPassword = watch('confirmPassword');

  const handleSignUp = async (values: SignUpValues) => {
    setIsLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        name: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      toast({
        title: 'Account Created Successfully!',
        description: 'Welcome to Attendly! Redirecting to login...',
      });

      router.push('/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: 'Registration Failed',
        description: err.response?.data?.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full card-glass border-0 shadow-2xl animate-fade-in">
      <CardHeader className="space-y-4 pb-6 sm:pb-8 px-4 sm:px-6 pt-6 sm:pt-8">
        <CardTitle className="text-responsive-lg font-bold text-center text-gray-900">
          Create Account
        </CardTitle>
        <p className="text-center text-gray-600 text-responsive-sm">
          Fill in your details to join our platform
        </p>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-3 sm:space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-responsive-sm font-medium">Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your username"
                      className="h-10 sm:h-11 focus-ring text-responsive-sm"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-responsive-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      placeholder="Enter your email"
                      className="h-10 sm:h-11 focus-ring text-responsive-sm"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-responsive-sm font-medium">Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-11 focus-ring text-responsive-sm">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-responsive-sm font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="h-10 sm:h-11 pr-12 focus-ring text-responsive-sm"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent touch-target"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? 
                          <EyeOff className="h-4 w-4 text-gray-500" /> : 
                          <Eye className="h-4 w-4 text-gray-500" />
                        }
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-responsive-sm font-medium">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="h-10 sm:h-11 pr-12 focus-ring text-responsive-sm"
                        disabled={isLoading}
                      />
                      {watchPassword === watchConfirmPassword && watchConfirmPassword && (
                        <div className="absolute inset-y-0 right-12 pr-3 flex items-center text-green-500">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent touch-target"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? 
                          <EyeOff className="h-4 w-4 text-gray-500" /> : 
                          <Eye className="h-4 w-4 text-gray-500" />
                        }
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-11 sm:h-12 btn-secondary font-semibold shadow-lg hover:shadow-xl touch-target text-responsive-sm"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <p className="text-center text-responsive-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors duration-200 touch-target">
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}