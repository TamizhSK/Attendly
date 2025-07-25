import React from 'react';
import Link from "next/link"
import Image from 'next/image'
import AttendlyLogo from './AttendlyLogo';
import { Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardImage from '@/public/image.jpg';

// Server component - Feature card component for reusability
const FeatureCard = ({ icon: Icon, title, description }: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}) => (
  <Card className="group transform transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
    <CardContent className="p-6 sm:p-8">
      <div className="mb-4 sm:mb-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-all duration-300">
          <Icon size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-purple-200/20 rounded-full blur-3xl animate-pulse [animation-delay:4s]"></div>
      </div>
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-white/20 safe-top">
        <div className="container mx-auto px-responsive py-4 flex justify-between items-center">
          <div className="flex items-center">
            <AttendlyLogo size="lg" className="hover:scale-105 transition-transform duration-300"/>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-3">
            <Button asChild variant="ghost" className="hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-medium touch-target text-sm px-3 sm:px-4 transition-all duration-200">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 touch-target text-sm px-4 sm:px-6">
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative container mx-auto px-responsive py-12 sm:py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 sm:mb-16 lg:mb-0 animate-fade-in">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight">
            Streamline Student{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Attendance Management
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 lg:mr-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Transform your educational institution with intelligent attendance tracking, comprehensive analytics, and seamless management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Button asChild size="lg" className="group px-8 sm:px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 touch-target text-base sm:text-lg font-semibold">
              <Link href="/login">
                Start Free Trial
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16">
            <div className="flex justify-center lg:justify-start items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">TRACK</div>
              <div className="text-2xl font-bold text-gray-400">MANAGE</div>
              <div className="text-2xl font-bold text-gray-400">ANALYZE</div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center animate-scale-in [animation-delay:0.3s]">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-2xl">
            {/* Enhanced floating elements */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full absolute -top-8 -left-8 sm:-top-12 sm:-left-12 opacity-20 blur-3xl animate-pulse"></div>
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 opacity-20 blur-3xl animate-pulse [animation-delay:1s]"></div>
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full absolute top-1/2 -right-4 opacity-15 blur-3xl animate-pulse [animation-delay:2s]"></div>
            
            {/* Main dashboard preview */}
            <div className="relative z-10 bg-white/90 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/50">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
                <Image 
                  src={DashboardImage} 
                  alt="Attendance Management Dashboard" 
                  width={700} 
                  height={400}
                  quality={90} 
                  priority={true}
                  placeholder="blur"
                  className="w-full h-auto transform hover:scale-105 transition-all duration-700 ease-out"
                />
                
                {/* Overlay elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating UI elements */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-bounce [animation-delay:3s]">
                  99% Accuracy
                </div>
              </div>
              
              {/* Dashboard stats preview */}
              <div className="mt-4 flex justify-between items-center px-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Live Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Real-time Analytics</span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-responsive py-16 sm:py-20 lg:py-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white rounded-3xl -mx-4 sm:-mx-8"></div>
        
        <div className="relative">
          <div className="text-center mb-12 sm:mb-16">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium">
                Powerful Features
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Efficient Management
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              Our comprehensive attendance management system provides all the tools you need to streamline tracking, generate insights, and improve educational outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          <FeatureCard 
            icon={Users}
            title="Student Tracking"
            description="Monitor individual and group attendance with detailed insights and reports."
          />
          <FeatureCard 
            icon={CheckCircle}
            title="Easy Verification"
            description="Quickly mark and verify attendance with our intuitive interface."
          />
          <FeatureCard 
            icon={Clock}
            title="Real-time Reporting"
            description="Generate instant reports and track attendance trends effortlessly."
          />
        </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-700 to-purple-700 "></div>
        <div className="absolute inset-0 opacity-20 bg-gradient-radial from-white/10 to-transparent"></div>
        
        <div className="relative container mx-auto px-responsive py-16 sm:py-20 lg:py-24 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
              Ready to Get Started?
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 sm:mb-8">
            Transform Your
            <span className="block text-yellow-300">Attendance Management</span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto px-4 leading-relaxed">
            Join over 500 educational institutions that trust Attendly for their attendance management needs. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button asChild size="lg" className="group px-10 sm:px-12 py-4 sm:py-5 bg-white text-blue-600 hover:bg-gray-50 rounded-2xl text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 touch-target">
              <Link href="/login">
                Start Free Trial
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </Button>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-b from-purple-900 to-indigo-900 text-white safe-bottom">
        
        <div className="relative">
          {/* Main Footer Content */}
          <div className="container mx-auto px-responsive py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <AttendlyLogo size="lg" className="mb-6 text-white" />
                </div>
                <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                  Transforming education through intelligent attendance management. Trusted by institutions worldwide.
                </p>
                
                {/* Social Proof */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">50+</div>
                    <div className="text-xs text-gray-300">Institutions</div>
                  </div>
                  <div className="w-px h-12 bg-gray-500"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">99.9%</div>
                    <div className="text-xs text-gray-300">Uptime</div>
                  </div>
                  <div className="w-px h-12 bg-gray-500"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300">24/7</div>
                    <div className="text-xs text-gray-300">Support</div>
                  </div>
                </div>
                
                {/* CTA */}
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/signup">Start Your Journey</Link>
                </Button>
              </div>
              
              {/* Quick Links */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 lg:col-span-3">
                <div>
                  <h4 className="font-bold text-white mb-6 text-lg">Product</h4>
                  <ul className="space-y-3">
                    <li><Link href="#features" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Features</span>
                    </Link></li>
                    <li><Link href="/login" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Dashboard</span>
                    </Link></li>
                    <li><Link href="/signup" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Get Started</span>
                    </Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-white mb-6 text-lg">Solutions</h4>
                  <ul className="space-y-3">
                    <li><Link href="#" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">For Schools</span>
                    </Link></li>
                    <li><Link href="#" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">For Universities</span>
                    </Link></li>
                    <li><Link href="#" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Enterprise</span>
                    </Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
                  <ul className="space-y-3">
                    <li><Link href="#" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Help Center</span>
                    </Link></li>
                    <li><Link href="#" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Contact Us</span>
                    </Link></li>
                    <li><Link href="#" className="text-gray-200 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Documentation</span>
                    </Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 bg-indigo-900 backdrop-blur-md">
            <div className="container mx-auto px-responsive py-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <p className="text-gray-300 text-sm font-medium">
                    © 2024 Attendly. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <Link href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
                    <span className="text-gray-600">•</span>
                    <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
                    <span className="text-gray-600">•</span>
                    <Link href="#" className="hover:text-white transition-colors duration-200">Cookies</Link>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span>Built with</span>
                  <span className="text-red-400 animate-pulse">❤️</span>
                  <span>for education</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}