import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import Loader from './loader'; // Client-side wrapper for Loader


const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap', // Improves font loading performance
  variable: '--font-inter', // CSS variable for applying font
});

export const metadata = {
  title: 'Attendly',
  description: 'Manage attendance with ease!',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M10 50 L40 90 L90 25' fill='none' stroke='white' stroke-width='20' stroke-linecap='round' stroke-linejoin='round'/></svg>"
        />
        <title>Attendly</title>
      </head>
      <body>
        {/* Client-side logic isolated in LoaderWrapper */}
        <Loader/>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
