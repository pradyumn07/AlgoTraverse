import React, { useState } from "react";

export default function QuickSort() {
  const [inputValue, setInputValue] = useState("");
  const [array, setArray] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [isSorting, setIsSorting] = useState(false);

  const handleAddArray = () => {
    const numbers = inputValue
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    setArray(numbers);
    setHighlighted([]);
    setPivotIndex(-1);
  };

  const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    setPivotIndex(high);  // ✅ Highlight pivot

    let i = low - 1;

    for (let j = low; j < high; j++) {
      setHighlighted([j, high]); // ✅ Highlight comparison with pivot
      await sleep(700); // slow animation for clarity

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(700);
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(700);

    return i + 1;
  };

  const quickSort = async (arr, low, high) => {
    if (low < high) {
      let pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  const runQuickSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    await quickSort(arr, 0, arr.length - 1);
    setHighlighted([]);
    setPivotIndex(-1);
    setIsSorting(false);
  };

  const maxVal = Math.max(...array, 0);

  return (
    <div className="flex flex-col items-center p-6 min-h-[calc(100vh-56px)] bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Quick Sort Visualizer</h1>

      {/* Input Array */}
      <div className="flex gap-2 mb-6">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Enter numbers separated by commas"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSorting}
        />
        <button
          onClick={handleAddArray}
          disabled={isSorting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Set Array
        </button>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-center gap-2 h-64 w-full max-w-3xl bg-gray-100 p-4 rounded shadow relative">
        {array.map((num, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-end transition-all duration-500"
            style={{
              height: `${(num / maxVal) * 100}%`,
              width: `${100 / array.length - 2}%`,
            }}
          >
            <div
              className="w-full transition-all duration-500 rounded-t"
              style={{
                height: "100%",
                backgroundColor:
                  pivotIndex === idx
                    ? "#ef4444" // pivot red
                    : highlighted.includes(idx)
                    ? "#f97316" // comparing orange
                    : "#10b981", // normal green
              }}
            ></div>
            <span className="mt-2 text-sm font-medium">{num}</span>

            {/* ✅ Pivot Label */}
            {pivotIndex === idx && (
              <span className="text-xs mt-1 text-red-600 font-bold animate-pulse">
                Pivot
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Run Button */}
      <button
        onClick={runQuickSort}
        disabled={isSorting || array.length === 0}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Run Quick Sort
      </button>
    </div>
  );
}
