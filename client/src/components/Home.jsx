import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] text-center bg-gradient-to-r from-indigo-100 via-white to-blue-100 font-[Poppins]">
      
      {/* Animated Title */}
      <motion.h1 
        className="text-5xl font-extrabold mb-4 text-gray-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-blue-600">AlgoTraverse</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        className="text-lg text-gray-600 mb-8 max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Experience and visualize graph algorithms interactively with animations and step-by-step traversal.
      </motion.p>

      {/* Call to Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
      >
        <Link 
          to="/graph"
          className="px-8 py-3 bg-blue-600 text-white text-lg rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
        >
          🚀 Start Exploring
        </Link>
      </motion.div>

      {/* Floating Background Circles */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200 rounded-full opacity-30 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}
