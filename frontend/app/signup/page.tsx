  'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Eye, EyeOff, Check, XCircle } from 'lucide-react';
import AttendlyLogo from '../AttendlyLogo';

interface SignUpValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

// Validation functions
const validateUsername = (username: string) => {
  const errors: string[] = [];
  if (!username) errors.push('Username is required.');
  if (username.length < 3) errors.push('At least 3 characters long.');
  if (username.length > 20) errors.push('Cannot exceed 20 characters.');
  if (!/^[a-zA-Z0-9_]+$/.test(username)) errors.push('Only letters, numbers, and underscores.');
  return errors;
};

const validateEmail = (email: string) => {
  const errors: string[] = [];
  if (!email) errors.push('Email is required.');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) errors.push('Enter a valid email address.');
  return errors;
};

const validatePassword = (password: string) => {
  const errors: string[] = [];
  const constraints = [
    { regex: /.*/, message: 'Password is required.', condition: () => !password },
    { regex: /.{8,}/, message: 'At least 8 characters long.', condition: () => password.length < 8 },
    { regex: /^.{0,50}$/, message: 'Cannot exceed 50 characters.', condition: () => password.length > 50 },
    { regex: /(?=.*[a-z])/, message: 'Include a lowercase letter.', condition: () => !/(?=.*[a-z])/.test(password) },
    { regex: /(?=.*[A-Z])/, message: 'Include an uppercase letter.', condition: () => !/(?=.*[A-Z])/.test(password) },
    { regex: /(?=.*\d)/, message: 'Include a number.', condition: () => !/(?=.*\d)/.test(password) },
    { regex: /(?=.*[!@#$%^&*])/, message: 'Include a special character.', condition: () => !/(?=.*[!@#$%^&*])/.test(password) },
  ];

  constraints.forEach(({ condition, message }) => {
    if (condition()) errors.push(message);
  });

  return errors;
};


export default function SignUpPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    mode: 'onChange'
  });

  const { control, watch, setError, clearErrors, formState: { errors } } = form;
  const watchPassword = watch('password');
  const watchConfirmPassword = watch('confirmPassword');

  // Dynamic validation for confirm password
  useEffect(() => {
    if (watchPassword && watchConfirmPassword) {
      if (watchPassword !== watchConfirmPassword) {
        setError('confirmPassword', {
          message: 'Passwords do not match.',
        });
      } else {
        clearErrors('confirmPassword');
      }
    }
  }, [watchPassword, watchConfirmPassword, setError, clearErrors]);

  const handleSignUp = async (values: SignUpValues) => {
    try {
      await axios.post('http://localhost:3001/api/auth/signup', {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      toast({
        title: 'Success',
        description: 'Account created successfully. Redirecting to login...',
      });

      router.push('/login');
    } catch (err) {
      console.error('Signup error:', err);
      toast({
        title: 'Error',
        description: 'Failed to register. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Constraint Messaging Component
  const ConstraintMessages = ({ errors }: { errors: string[] }) => {
    if (errors.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {errors.map((error, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-2 text-red-600"
          >
            <XCircle className="h-4 w-4" />
            <span className="text-xs">{error}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-teal-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <AttendlyLogo size="lg" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create an Account</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              rules={{
                validate: () => {
                  const usernameErrors = validateUsername(form.getValues('username'));
                  return usernameErrors.length === 0 || usernameErrors;
                }
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-black text-base">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your username"
                      className={`
                        ${fieldState.error 
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200' 
                          : field.value 
                          ? 'border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-200' 
                          : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-blue-200'
                        }
                      `}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <ConstraintMessages 
                      errors={
                        Array.isArray(fieldState.error.message) 
                          ? fieldState.error.message 
                          : validateUsername(field.value)
                      } 
                    />
                  )}
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              rules={{
                validate: () => {
                  const emailErrors = validateEmail(form.getValues('email'));
                  return emailErrors.length === 0 || emailErrors;
                }
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-black text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your email"
                      className={`
                        ${fieldState.error 
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200' 
                          : field.value 
                          ? 'border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-200' 
                          : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-blue-200'
                        }
                      `}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <ConstraintMessages 
                      errors={
                        Array.isArray(fieldState.error.message) 
                          ? fieldState.error.message 
                          : validateEmail(field.value)
                      } 
                    />
                  )}
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              rules={{
                required: 'Role is required.',
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-black text-base">
                    Role
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger 
                      className={`w-full 
                        ${fieldState.error 
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200' 
                          : field.value 
                          ? 'border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-200' 
                          : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-blue-200'
                        }
                      `}
                    >
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <ConstraintMessages errors={fieldState.error?.message ? [fieldState.error.message] : []} />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              rules={{
                validate: () => {
                  const passwordErrors = validatePassword(form.getValues('password'));
                  return passwordErrors.length === 0 || passwordErrors;
                }
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-black text-base">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`
                          ${fieldState.error 
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-blue-200'
                          }
                        `}
                      />
                      {watchPassword === watchConfirmPassword && watchPassword && (
                        <div className="absolute inset-y-0 right-10 pr-3 flex items-center text-green-500">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <ConstraintMessages errors={validatePassword(watchPassword)} />
                  )}
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: 'Please confirm your password.',
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-black text-base">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className={`
                          ${fieldState.error 
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-blue-200'
                          }
                        `}
                      />
                      {watchPassword === watchConfirmPassword && watchConfirmPassword && (
                        <div className="absolute inset-y-0 right-10 pr-3 flex items-center text-green-500">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <ConstraintMessages errors={fieldState.error?.message ? [fieldState.error.message] : []} />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-tr from-green-500 to-teal-400"
              
            >
              Sign Up
            </Button>
          </form>
        </Form>

        {/* Login Link */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}