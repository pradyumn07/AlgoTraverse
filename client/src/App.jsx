import React, { useState } from 'react'
import Header from './components/Header'
import Graph from './components/Graph'
import { Toaster } from 'react-hot-toast'

export default function App() {
  const [darkMode, setDarkMode] = useState(false); // ✅ Define state

  return (
    <div className={darkMode ? 'dark bg-gray-900 min-h-screen text-white' : 'bg-white min-h-screen text-black'}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} /> {/* ✅ Pass props */}
      <Graph />
      <Toaster position='bottom-center' />
    </div>
  )
}
