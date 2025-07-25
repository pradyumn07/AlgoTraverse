import React, { useState } from 'react';

export default function FCFS() {
  const [processes, setProcesses] = useState([]);
  const [pid, setPid] = useState('');
  const [burst, setBurst] = useState('');
  const [arrival, setArrival] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [resultTable, setResultTable] = useState([]);
  const [avgTAT, setAvgTAT] = useState(0);
  const [avgWT, setAvgWT] = useState(0);

  // ✅ Add new process with validation
  const addProcess = () => {
    if (!pid || burst === '' || arrival === '') return;
    if (burst < 0 || arrival < 0) return alert("Arrival Time and Burst Time cannot be negative!");
    setProcesses([...processes, { pid, burst: parseInt(burst), arrival: parseInt(arrival) }]);
    setPid('');
    setBurst('');
    setArrival('');
  };

  // ✅ Run FCFS Algorithm
  const runFCFS = () => {
    const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
    let time = 0;
    let steps = [];
    let results = [];

    sorted.forEach((p) => {
      if (time < p.arrival) time = p.arrival;
      const start = time;
      const end = time + p.burst;

      steps.push({ pid: p.pid, start, end });

      const CT = end;
      const TAT = CT - p.arrival;
      const WT = TAT - p.burst;

      results.push({ pid: p.pid, arrival: p.arrival, burst: p.burst, CT, TAT, WT });

      time += p.burst;
    });

    // ✅ Calculate averages
    const totalTAT = results.reduce((sum, p) => sum + p.TAT, 0);
    const totalWT = results.reduce((sum, p) => sum + p.WT, 0);
    setAvgTAT((totalTAT / results.length).toFixed(2));
    setAvgWT((totalWT / results.length).toFixed(2));

    setTimeline(steps);
    setResultTable(results);
    setCurrentStep(-1);
    setIsRunning(true);

    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === steps.length - 1) setIsRunning(false);
      }, index * 2000);
    });
  };

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 min-h-[calc(100vh-56px)]">
      <h1 className="text-2xl font-bold mb-4">FCFS Scheduling</h1>

      {/* ✅ Process Input */}
      <div className="flex gap-2 mb-4">
        <input className="border px-3 py-1 rounded" placeholder="PID" value={pid} onChange={e => setPid(e.target.value)} />
        <input className="border px-3 py-1 rounded" placeholder="Burst Time" type="number" min="0" value={burst} onChange={e => setBurst(Math.max(0, e.target.value))} />
        <input className="border px-3 py-1 rounded" placeholder="Arrival Time" type="number" min="0" value={arrival} onChange={e => setArrival(Math.max(0, e.target.value))} />
        <button onClick={addProcess} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Add</button>
      </div>

      {/* ✅ Show added processes */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Processes:</h2>
        <ul className="space-y-1">
          {processes.map((p, i) => (
            <li key={i} className="bg-white px-3 py-1 rounded shadow">
              {p.pid} | BT: {p.burst} | AT: {p.arrival}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Run Button */}
      <button
        onClick={runFCFS}
        disabled={isRunning || processes.length === 0}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Run FCFS
      </button>

      {/* ✅ Gantt Chart */}
      <div className="mt-8 w-full max-w-3xl relative">
        <div className="flex bg-gray-200 rounded overflow-hidden h-24 items-stretch">
          {timeline.map((step, index) => (
            <div
              key={index}
              className="flex items-center justify-center text-white font-bold transition-all duration-700 h-full"
              style={{
                backgroundColor: currentStep >= index ? '#3b82f6' : '#9ca3af',
                width: `${(step.end - step.start) * 60}px`,
                borderRight: '2px solid white'
              }}
            >
              {step.pid}
            </div>
          ))}
        </div>
        <div className="flex mt-2 relative">
          {timeline.map((step, index) => (
            <span key={index} style={{ position: 'absolute', left: `${step.start * 60}px` }} className="text-xs">
              {step.start}
            </span>
          ))}
          {timeline.length > 0 && (
            <span style={{ position: 'absolute', left: `${timeline[timeline.length - 1].end * 60}px` }} className="text-xs">
              {timeline[timeline.length - 1].end}
            </span>
          )}
        </div>
      </div>

      {/* ✅ Result Table */}
      {resultTable.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-lg font-bold mb-2">Results</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-1">PID</th>
                <th className="border px-3 py-1">AT</th>
                <th className="border px-3 py-1">BT</th>
                <th className="border px-3 py-1">CT</th>
                <th className="border px-3 py-1">TAT</th>
                <th className="border px-3 py-1">WT</th>
              </tr>
            </thead>
            <tbody>
              {resultTable.map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-3 py-1">{row.pid}</td>
                  <td className="border px-3 py-1">{row.arrival}</td>
                  <td className="border px-3 py-1">{row.burst}</td>
                  <td className="border px-3 py-1">{row.CT}</td>
                  <td className="border px-3 py-1">{row.TAT}</td>
                  <td className="border px-3 py-1">{row.WT}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Averages */}
          <div className="mt-4 bg-gray-100 p-3 rounded text-center">
            <p className="font-semibold">Average Turnaround Time (TAT): <span className="text-blue-600">{avgTAT}</span></p>
            <p className="font-semibold">Average Waiting Time (WT): <span className="text-green-600">{avgWT}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
