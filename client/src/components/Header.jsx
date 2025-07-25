import { Link } from 'react-router-dom'
import { FaMoon, FaSun } from "react-icons/fa";
function Header({ darkMode, setDarkMode }) {
  return (
    <header className="flex justify-between p-4 shadow-md">
      {/* ✅ Keep your existing logo */}
      <img src="/logo_algo.png" alt="AlgoTraverse Logo" className="h-8" />

      <nav className="flex gap-6">
        {/* ✅ Add this link */}
        <Link to="/graph" className="hover:text-blue-500">Graph Algos</Link>
        <Link to="/os" className="hover:text-blue-500">OS Algorithms</Link>

      </nav>

      {/* ✅ Keep your dark mode button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="ml-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 transition duration-200"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
      </button>
    </header>
  )
}

export default Header;
