import React from 'react';
import AttendlyLogo from '../AttendlyLogo';
import { LoginForm } from '@/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Attendly account to manage attendance records.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen-safe w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background Elements - Optimized for all screens */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 xs:w-28 xs:h-28 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-300/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 xs:w-32 xs:h-32 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-indigo-300/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-16 h-16 xs:w-20 xs:h-20 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-purple-300/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Enhanced Mobile-First Responsive Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen-safe">
        {/* Desktop Branding Section - Properly Responsive */}
        <div className="hidden lg:flex flex-col justify-center px-6 xl:px-12 2xl:px-16 py-8">
          <div className="max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto lg:mx-36 animate-fade-in">
            <div className="mb-8">
              <AttendlyLogo size="xl" />
            </div>
            
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Welcome back to
              <span className="text-blue-600 block">Attendly</span>
            </h1>
            
            <p className="text-lg xl:text-xl text-gray-600 leading-relaxed mb-8 max-w-md">
              Your smart attendance management solution. Track, manage, and analyze student attendance with ease.
            </p>
            
            {/* Feature Highlights */}
            <div className="space-y-4 animate-slide-up" style={{animationDelay: '300ms'}}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-base xl:text-lg">Real-time attendance tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-base xl:text-lg">Comprehensive reporting system</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-base xl:text-lg">Secure and reliable platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Section - Enhanced Mobile Responsiveness */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="w-full max-w-sm sm:max-w-md animate-scale-in">
            {/* Mobile Header - Improved spacing and typography */}
            <div className="lg:hidden mb-8 text-center">
              <div className="mb-6">
                <AttendlyLogo size="lg" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
            </div>
            
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
