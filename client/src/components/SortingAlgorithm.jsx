import React from "react";
import { Link } from "react-router-dom";

export default function SortingAlgorithms() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Sorting Visualizer</h1>
      <p className="text-gray-600 mb-6 max-w-xl text-center">
        Learn and visualize popular sorting algorithms step-by-step with animations. 
        Choose an algorithm below to start!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
        <Link
          to="/sorting/bubble"
          className="px-6 py-4 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition text-center"
        >
          Bubble Sort
        </Link>
        <Link
          to="/sorting/merge"
          className="px-6 py-4 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition text-center"
        >
          Merge Sort
        </Link>
        <Link
          to="/sorting/quick"
          className="px-6 py-4 bg-purple-500 text-white rounded-xl shadow-lg hover:bg-purple-600 transition text-center"
        >
          Quick Sort
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        💡 Tip: You can generate random arrays and control speed for better understanding.
      </div>
    </div>
  );
}
