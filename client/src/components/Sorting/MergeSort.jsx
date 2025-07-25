import React, { useState } from "react";

export default function MergeSort() {
  const [inputValue, setInputValue] = useState("");
  const [array, setArray] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  const [isSorting, setIsSorting] = useState(false);

  const handleAddArray = () => {
    const numbers = inputValue
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    setArray(numbers);
    setHighlighted([]);
  };

  const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

  const merge = async (arr, start, mid, end) => {
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      setHighlighted([start + i, mid + 1 + j]);
      await sleep(500); // animation speed

      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      setArray([...arr]);
    }

    while (i < left.length) {
      arr[k++] = left[i++];
      setArray([...arr]);
      await sleep(500);
    }

    while (j < right.length) {
      arr[k++] = right[j++];
      setArray([...arr]);
      await sleep(500);
    }
  };

  const mergeSort = async (arr, start, end) => {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, start, mid);
    await mergeSort(arr, mid + 1, end);
    await merge(arr, start, mid, end);
  };

  const runMergeSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    await mergeSort(arr, 0, arr.length - 1);
    setHighlighted([]);
    setIsSorting(false);
  };

  const maxVal = Math.max(...array, 0);

  return (
    <div className="flex flex-col items-center p-6 min-h-[calc(100vh-56px)] bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Merge Sort Visualizer</h1>

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
      <div className="flex items-end justify-center gap-2 h-64 w-full max-w-3xl bg-gray-100 p-4 rounded shadow">
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
                backgroundColor: highlighted.includes(idx)
                  ? "#f97316"
                  : "#10b981",
              }}
            ></div>
            <span className="mt-2 text-sm font-medium">{num}</span>
          </div>
        ))}
      </div>

      {/* Run Button */}
      <button
        onClick={runMergeSort}
        disabled={isSorting || array.length === 0}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Run Merge Sort
      </button>
    </div>
  );
}
