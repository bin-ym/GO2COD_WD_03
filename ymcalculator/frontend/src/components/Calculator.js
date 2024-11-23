import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [openParentheses, setOpenParentheses] = useState(true);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false); // Track if result is displayed

  // Fetch history from backend on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/history");
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  // Safe expression evaluation using math.js
  const evaluateExpression = (expression) => {
    try {
      return evaluate(expression);
    } catch {
      return "";
    }
  };

  // Handle button clicks
  const handleButtonClick = async (value) => {
    if (value === "C") {
      setInput("");
      setResult("");
      setIsResultDisplayed(false); // Reset flag
    } else if (value === "=") {
      if (input.trim() === "") return;
      const finalResult = evaluateExpression(input);
      if (finalResult !== "") {
        const historyItem = {
          _id: new Date().getTime(),
          expression: input,
          result: finalResult,
        };

        // Update history in the frontend
        setHistory((prev) => [...prev, historyItem]);

        // Save the history to the backend
        try {
          await fetch("http://localhost:5000/api/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(historyItem),
          });
        } catch (error) {
          console.error("Failed to save history:", error);
        }
      }
      setResult(finalResult);
      setInput(finalResult.toString());
      setIsResultDisplayed(true); // Set result displayed flag
    } else if (value === "%") {
      const percentageResult = evaluateExpression(input) / 100;
      setInput(percentageResult.toString());
      setResult(percentageResult);
    } else if (value === "+/-") {
      if (input) {
        const toggledInput = input.startsWith("-")
          ? input.slice(1)
          : `-${input}`;
        setInput(toggledInput);
        setResult(evaluateExpression(toggledInput));
      }
    } else if (value === "()") {
      const newInput = input + (openParentheses ? "(" : ")");
      setInput(newInput);
      setOpenParentheses(!openParentheses);
    } else {
      let newInput = input;

      // If result is displayed and a number is typed, clear the result
      if (isResultDisplayed && !/[+\-*/]/.test(value)) {
        setResult(""); // Clear the result
        newInput = value; // Start with the number typed
        setIsResultDisplayed(false); // Reset result flag
      } else {
        // Replace last operator if a new operator is clicked
        const lastChar = input.charAt(input.length - 1);
        const operators = /[+\-*/]/;
        if (operators.test(lastChar) && operators.test(value)) {
          newInput = input.slice(0, -1) + value; // Replace last operator with the new one
        } else {
          newInput = input + value;
        }
      }

      setInput(newInput);
      const endsWithOperator = /[+\-*/]$/.test(newInput);
      if (!endsWithOperator) {
        const liveResult = evaluateExpression(newInput);
        setResult(liveResult);
      } else {
        setResult("");
      }
    }
  };

  // Handle history item click
  const handleHistoryClick = (historyItem) => {
    setInput(historyItem.expression); // Use the expression from the history item
    setResult(historyItem.result); // Use the result from the history item
    setShowHistory(false);
  };

  // Handle clearing history
  const handleClearHistory = async () => {
    try {
      // Clear history in the backend
      await fetch("http://localhost:5000/api/history", { method: "DELETE" });
      setHistory([]); // Clear history on the frontend
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const buttons = [
    "C",
    "()",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "+/-",
    "0",
    ".",
    "=",
  ];

  return (
    <div className="relative max-w-sm p-4 mx-auto mt-10 rounded-lg shadow-lg bg-blue-50">
      {" "}
      {/* Changed background color */}
      <div className="p-4 mb-5 bg-white rounded-lg shadow-md">
        {" "}
        {/* Added margin to create space */}
        <div className="text-sm text-gray-500">{input || "0"}</div>
        <div className="text-xl font-bold text-black">{result || "0"}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button) => (
          <button
            key={button}
            onClick={() => handleButtonClick(button)}
            className={`p-4 rounded-lg text-white font-bold text-lg shadow-md ${
              button === "="
                ? "bg-green-500 hover:bg-green-600"
                : button === "C"
                ? "bg-red-500 hover:bg-red-600"
                : ["/", "*", "-", "+", "%", "()", "+/-"].includes(button)
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            {button}
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowHistory(true)}
        className="w-full py-2 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        View History
      </button>
      {showHistory && (
        <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-80">
          <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-center">History</h3>
            <ul className="overflow-y-auto text-sm max-h-48">
              {history.length > 0 ? (
                history.map((item) => (
                  <li
                    key={item._id} // Unique key for each history item
                    className="py-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => handleHistoryClick(item)}
                  >
                    {item.expression} = {item.result}
                  </li>
                ))
              ) : (
                <li>No history found</li>
              )}
            </ul>

            <div className="mt-4 text-center">
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Clear History
              </button>
              <button
                onClick={() => setShowHistory(false)}
                className="px-4 py-2 ml-2 font-bold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
