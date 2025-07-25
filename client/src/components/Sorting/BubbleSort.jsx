import React, { useState } from "react";

export default function BubbleSort() {
  const [inputValue, setInputValue] = useState("");
  const [array, setArray] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [swapping, setSwapping] = useState([]);
  const [isSorting, setIsSorting] = useState(false);

  const handleAddArray = () => {
    const numbers = inputValue.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    setArray(numbers);
    setCurrentStep(-1);
    setSwapping([]);
  };

  const runBubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setCurrentStep(j);
        setSwapping([j, j + 1]);

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
        }
      }
    }

    setSwapping([]);
    setIsSorting(false);
  };

  const maxVal = Math.max(...array, 0);

  return (
    <div className="flex flex-col items-center p-6 min-h-[calc(100vh-56px)] bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Bubble Sort Visualizer</h1>

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
                backgroundColor: swapping.includes(idx)
                  ? "#f97316"
                  : currentStep === idx
                  ? "#3b82f6"
                  : "#10b981",
              }}
            ></div>
            <span className="mt-2 text-sm font-medium">{num}</span>
          </div>
        ))}
      </div>

      {/* Run Button */}
      <button
        onClick={runBubbleSort}
        disabled={isSorting || array.length === 0}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Run Bubble Sort
      </button>
    </div>
  );
}
