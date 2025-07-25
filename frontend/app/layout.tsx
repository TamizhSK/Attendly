import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Loader from './loader';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata = {
  title: {
    default: 'Attendly - Smart Attendance Management',
    template: '%s | Attendly'
  },
  description: 'Streamline student attendance management with our intelligent platform. Track, manage, and analyze attendance effortlessly.',
  keywords: ['attendance', 'management', 'education', 'student', 'tracking'],
  authors: [{ name: 'Attendly Team' }],
  creator: 'Attendly',
  publisher: 'Attendly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico"
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        <Loader/>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
