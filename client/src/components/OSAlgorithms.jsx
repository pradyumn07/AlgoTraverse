import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OSAlgorithms() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-extrabold mb-3 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Operating System Algorithms
      </motion.h1>

      <motion.p
        className="text-gray-600 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Visualize CPU Scheduling interactively!
      </motion.p>

      {/* CPU Scheduling Button */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link
          className="block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition transform text-center"
          to="/os/cpu"
        >
          🔥 CPU Scheduling
        </Link>
      </motion.div>
    </div>
  );
}
