import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Graph from './components/Graph'
import { Toaster } from 'react-hot-toast'
import Home from './components/Home'
import OSAlgorithms from './components/OSAlgorithms';
import CPUScheduling from './components/OS/CPUScheduling';
import FCFS from './components/OS/FCFS';
import SJF from './components/OS/SJF'; 
import PriorityScheduling from './components/OS/PriorityScheduling';
import RoundRobin from './components/OS/RoundRobin';
import SortingAlgorithms from './components/SortingAlgorithm'
import BubbleSort from './components/Sorting/BubbleSort'
import MergeSort from './components/Sorting/MergeSort'
import QuickSort from './components/Sorting/QuickSort'

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={darkMode ? 'dark bg-gray-900 min-h-screen text-white' : 'bg-white min-h-screen text-black'}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          <Route path="/" element={<Home />} />  {/* Keep your home page */}
          <Route path="/graph" element={<Graph />} />  {/* ✅ Graph route */}
          <Route path="/os" element={<OSAlgorithms />} />
          <Route path="/os/cpu" element={<CPUScheduling />} />
          <Route path="/os/cpu/fcfs" element={<FCFS />} />
          <Route path="/os/cpu/sjf" element={<SJF />} />
          <Route path="/os/cpu/priority" element={<PriorityScheduling />} />
          <Route path="/os/cpu/roundrobin" element={<RoundRobin />} />
          <Route path="/sorting" element={<SortingAlgorithms />} />
          <Route path="/sorting/bubble" element={<BubbleSort />} />
          <Route path="/sorting/merge" element={<MergeSort />} />
          <Route path="/sorting/quick" element={<QuickSort />} />
        </Routes>

        <Toaster position='bottom-center' />
      </div>
    </Router>
  )
}
