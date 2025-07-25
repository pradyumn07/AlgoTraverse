import React from 'react';
import { Link } from 'react-router-dom';

export default function CPUScheduling() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">CPU Scheduling Algorithms</h1>
      <p className="text-gray-600 mb-8">Visualize different CPU scheduling techniques</p>

      <div className="grid gap-4">
        <Link className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" to="/os/cpu/fcfs">
          FCFS (First Come First Serve)
        </Link>
        <Link className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" to="/os/cpu/sjf">
          SJF (Shortest Job First)
        </Link>
        <Link className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600" to="/os/cpu/priority">
          Priority Scheduling
        </Link>
        <Link className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" to="/os/cpu/roundrobin">
          Round Robin
        </Link>
      </div>
    </div>
  );
}
