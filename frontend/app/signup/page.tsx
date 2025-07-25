import React from 'react';
import AttendlyLogo from '../AttendlyLogo';
import { SignupForm } from '@/components/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Attendly account to start managing attendance records.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 relative">
      {/* Background Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Mobile-First Responsive Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen safe-top safe-bottom">
        {/* Sign Up Form Section - Mobile First */}
        <div className="flex-1 flex items-center justify-center px-responsive py-responsive">
          <div className="w-full max-w-md animate-scale-in">
            {/* Mobile Logo and Header */}
            <div className="lg:hidden mb-8 text-center">
              <AttendlyLogo size="lg" />
              <h2 className="mt-4 text-responsive-lg font-bold text-gray-900">Join Attendly</h2>
              <p className="mt-2 text-responsive-sm text-gray-600">Create your account to get started</p>
            </div>
            
            <SignupForm />
          </div>
        </div>

        {/* Desktop Branding - Hidden on mobile */}
        <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-responsive py-responsive">
          <div className="max-w-md xl:max-w-lg animate-fade-in">
            <AttendlyLogo size="xl" />
            <h1 className="mt-8 text-responsive-xl font-bold text-gray-900 leading-tight">
              Start your journey with
              <span className="text-emerald-600 block">Attendly</span>
            </h1>
            <p className="mt-4 text-responsive-base text-gray-600 leading-relaxed">
              Join thousands of educators who trust Attendly for their attendance management needs.
            </p>
            
            {/* Benefits */}
            <div className="mt-8 space-y-4 animate-slide-up" style={{animationDelay: '300ms'}}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-responsive-sm">Quick and easy setup</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-responsive-sm">Intuitive dashboard interface</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-responsive-sm">24/7 reliable support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}