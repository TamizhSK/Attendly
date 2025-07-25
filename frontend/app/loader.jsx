'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check sessionStorage to determine if loader has already been shown
    const loaderShown = sessionStorage.getItem('loaderShown');

    if (loaderShown) {
      // If already shown, disable the loader immediately
      setIsLoading(false);
    } else {
      // Show loader for the first visit
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('loaderShown', 'true'); // Set loader as shown
        router.push('/'); // Navigate to the landing page
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [router]);

  if (!isLoading) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: [0, 0.3], scale: [0.8, 1] },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="inset-0 min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center relative overflow-hidden z-50"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center relative z-10 w-full max-w-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="mx-auto mb-8 w-64 h-64">
          <defs>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E6E6E6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="350" height="350" fill="url(#gridPattern)" opacity="0.3" />
          <motion.path
            d="M75 150 L125 200 L225 100"
            fill="none"
            stroke="#2563EB"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkmarkVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeDasharray="5 5"
            variants={highlightVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>

        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Attendly</h2>
          <p className="text-xl text-gray-600 mb-8">Streamline Your Attendance Management</p>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-8 text-gray-500 text-sm italic"
      >
        Redirecting to the homepage...
      </motion.p>
    </motion.div>
  );
};

export default Loader;
