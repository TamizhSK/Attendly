'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link"
import Image from 'next/image'
import AttendlyLogo from './AttendlyLogo';
import { Users, CheckCircle, Clock } from "lucide-react";
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuTrigger, 
  NavigationMenuContent, 
  NavigationMenuLink 
} from "@/components/ui/navigation-menu";

import DashboardImage from '@/public/image.jpg';

export default function LandingPage() {
  // Feature card component for reusability
  const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-4 text-blue-600">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span>
            <AttendlyLogo size="lg"/></span>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-blue-100 text-base ">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    <NavigationMenuLink href="#features" className="block hover:bg-slate-100 p-2 rounded">
                      Explore Features
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Login
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/signup" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                  Sign Up
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Streamline Student <br />
            <span className="text-blue-600">Attendance Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 mr-5">
            Effortlessly track, manage, and analyze student attendance with our intelligent platform.
          </p>
          <div className="flex justify-center lg:justify-start space-x-4">
            <Link 
              href="/login" 
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:border-teal-600 hover:text-white rounded-full hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative">
            <div className="bg-blue-500 w-64 h-64 rounded-full absolute -top-8 -left-8 opacity-10 blur-2xl"></div>
            <div className="bg-blue-300 w-72 h-72 rounded-full absolute -bottom-8 -right-8 opacity-10 blur-2xl"></div>
            <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl">
            <Image 
              src={DashboardImage} 
              alt="Attendance Management Dashboard" 
              width={700} 
              quality={100} 
              priority={true}
              className="rounded-xl hover:scale-105 transition-all ease-in-out object-cover priority"
            />

            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 bg-gray-50 rounded-t-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Efficient Management
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our attendance management system provides comprehensive tools to simplify tracking and reporting.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
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
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Attendance Management?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of educational institutions in simplifying their attendance tracking.
          </p>
          <Link 
            href="/login" 
            className="px-10 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold transition-all ease-in-out hover:shadow-xl"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Attendly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}