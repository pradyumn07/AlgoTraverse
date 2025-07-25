import React from "react";

import { FaMoon, FaSun } from "react-icons/fa";
import logo_algo from './logo_algo.png'
export default function Header({darkMode, setDarkMode}) {


  return (
    <header
      className={`shadow-md flex items-center justify-between py-3 px-6 w-full rounded-lg ${darkMode ? "bg-gray-500 text-white" : "bg-white text-gray-900"
        }`}
    >
      <section className="flex items-center">
        <h1 className="text-2xl  font-bold">
          <img className="h-10" src={logo_algo} alt="" />
          {/* Graph<span className="text-blue-500">Viz</span> Tool */}
        </h1>
      </section>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6">
        <a
          href="#features"
          className="hover:text-blue-500 font-medium transition duration-200"
        >
          Features
        </a>
        <a
          href="#tutorials"
          className="hover:text-blue-500 font-medium transition duration-200"
        >
          Tutorials
        </a>
        <a
          href="#examples"
          className="hover:text-blue-500 font-medium transition duration-200"
        >
          Examples
        </a>
        <a
          href="#support"
          className="hover:text-blue-500 font-medium transition duration-200"
        >
          Support
        </a>
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="ml-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 transition duration-200"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
      </button>
    </header>
  );
}
