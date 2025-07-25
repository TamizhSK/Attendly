import React from 'react';
import { Inter } from 'next/font/google';
interface AttendlyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const inter = Inter({
  subsets:['latin'],
  weight: ['400','500','600','700','800'], // Specify font weights
  variable: '--font-inter' // Custom CSS variable for font
});

export default function AttendlyLogo({ 
  size = 'md', 
  className = '' 
}: AttendlyLogoProps) {
  // Define size-based classes
  const sizeClasses = {
    'xs': {
      textSize: 'text-xs',
      svgSize: 'w-6 h-6',
      svgMargin: 'mr-1'
    },
    'sm': {
      textSize: 'text-sm',
      svgSize: 'w-8 h-8',
      svgMargin: 'mr-2'
    },
    'md': {
      textSize: 'text-base',
      svgSize: 'w-10 h-10',
      svgMargin: 'mr-2'
    },
    'lg': {
      textSize: 'text-2xl',
      svgSize: 'w-12 h-12',
      svgMargin: 'mr-3'
    },
    'xl': {
      textSize: 'text-5xl',
      svgSize: 'w-14 h-14',
      svgMargin: 'mr-4'
    }
  };

  const { textSize, svgSize, svgMargin } = sizeClasses[size];

  return (
    <span 
      className={`
        ${textSize} 
        font-bold 
        text-blue-600 
        inline-flex 
        items-center 
        ${className}
      `}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className={`
          ${svgSize} 
          ${svgMargin}
        `}
      >
        {/* Minimalist checkmark design with abstract attendance concept */}
        <path
          d="M20 50 L45 75 L80 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Attendly
    </span>
  );
}