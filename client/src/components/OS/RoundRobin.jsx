import React, { useState } from 'react';

export default function RoundRobin() {
  const [processes, setProcesses] = useState([]);
  const [pid, setPid] = useState('');
  const [burst, setBurst] = useState('');
  const [arrival, setArrival] = useState('');
  const [quantum, setQuantum] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [resultTable, setResultTable] = useState([]);
  const [avgTAT, setAvgTAT] = useState(0);
  const [avgWT, setAvgWT] = useState(0);

  // ✅ Add Process
  const addProcess = () => {
    if (!pid || burst === '' || arrival === '') return;
    if (burst < 0 || arrival < 0) return alert("Arrival Time and Burst Time cannot be negative!");
    setProcesses([...processes, { pid, burst: parseInt(burst), arrival: parseInt(arrival) }]);
    setPid('');
    setBurst('');
    setArrival('');
  };

  // ✅ Run Round Robin
  const runRR = () => {
    if (!quantum || quantum <= 0) return alert("Please enter a valid quantum time!");

    let time = 0;
    let steps = [];
    let queue = [];
    let results = [];

    let remaining = processes.map(p => ({ ...p, remaining: p.burst, end: null }));
    remaining.sort((a, b) => a.arrival - b.arrival);

    while (remaining.some(p => p.remaining > 0)) {
      const available = remaining.filter(p => p.arrival <= time && p.remaining > 0 && !queue.includes(p));

      queue.push(...available.filter(p => !queue.includes(p)));

      if (queue.length === 0) {
        const nextArrival = remaining.find(p => p.remaining > 0).arrival;
        steps.push({ pid: 'Idle', start: time, end: nextArrival });
        time = nextArrival;
        continue;
      }

      const current = queue.shift();

      const start = time;
      const execTime = Math.min(current.remaining, parseInt(quantum));
      const end = time + execTime;
      steps.push({ pid: current.pid, start, end });

      current.remaining -= execTime;
      time = end;

      if (current.remaining === 0) {
        current.end = time;
        const CT = time;
        const TAT = CT - current.arrival;
        const WT = TAT - current.burst;
        results.push({ pid: current.pid, arrival: current.arrival, burst: current.burst, CT, TAT, WT });
      }

      const newAvailable = remaining.filter(p => p.arrival <= time && p.remaining > 0 && !queue.includes(p));
      queue.push(...newAvailable.filter(p => !queue.includes(p)));

      if (current.remaining > 0) queue.push(current);
    }

    setTimeline(steps);
    setResultTable(results);

    const totalTAT = results.reduce((sum, p) => sum + p.TAT, 0);
    const totalWT = results.reduce((sum, p) => sum + p.WT, 0);
    setAvgTAT((totalTAT / results.length).toFixed(2));
    setAvgWT((totalWT / results.length).toFixed(2));

    setCurrentStep(-1);
    setIsRunning(true);
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === steps.length - 1) setIsRunning(false);
      }, index * 1500);
    });
  };

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 min-h-[calc(100vh-56px)]">
      <h1 className="text-2xl font-bold mb-4">Round Robin Scheduling</h1>

      {/* ✅ Input */}
      <div className="flex gap-2 mb-4">
        <input className="border px-3 py-1 rounded" placeholder="PID" value={pid} onChange={e => setPid(e.target.value)} />
        <input className="border px-3 py-1 rounded" placeholder="Burst Time" type="number" min="0" value={burst} onChange={e => setBurst(Math.max(0, e.target.value))} />
        <input className="border px-3 py-1 rounded" placeholder="Arrival Time" type="number" min="0" value={arrival} onChange={e => setArrival(Math.max(0, e.target.value))} />
        <button onClick={addProcess} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Add</button>
      </div>

      <div className="flex gap-2 mb-4">
        <input className="border px-3 py-1 rounded" placeholder="Quantum" type="number" min="1" value={quantum} onChange={e => setQuantum(Math.max(1, e.target.value))} />
        <button
          onClick={runRR}
          disabled={isRunning || processes.length === 0}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Run Round Robin
        </button>
      </div>

      {/* ✅ Process List */}
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

      {/* ✅ Gantt Chart */}
      <div className="mt-8 w-full max-w-3xl relative">
        <div className="flex bg-gray-200 rounded overflow-hidden h-24 items-stretch">
          {timeline.map((step, index) => (
            <div
              key={index}
              className="flex items-center justify-center text-white font-bold transition-all duration-700 h-full"
              style={{
                backgroundColor: step.pid === 'Idle'
                  ? (currentStep >= index ? '#6b7280' : '#9ca3af')
                  : (currentStep >= index ? '#3b82f6' : '#9ca3af'),
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

          <div className="mt-4 bg-gray-100 p-3 rounded text-center">
            <p className="font-semibold">Average Turnaround Time (TAT): <span className="text-blue-600">{avgTAT}</span></p>
            <p className="font-semibold">Average Waiting Time (WT): <span className="text-green-600">{avgWT}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
