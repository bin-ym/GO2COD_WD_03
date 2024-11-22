import React, { useState } from 'react';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [openParentheses, setOpenParentheses] = useState(true); // For toggling `(` and `)`

  const evaluateExpression = (expression) => {
    try {
      return eval(expression); // Replace with a safer math parser in production
    } catch {
      return '';
    }
  };

  const handleButtonClick = (value) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      const finalResult = evaluateExpression(input);
      setResult(finalResult);
      setHistory((prev) => [...prev, `${input} = ${finalResult}`]);
      setInput(finalResult.toString());
    } else if (value === '%') {
      const percentageResult = evaluateExpression(input) / 100;
      setInput(percentageResult.toString());
      setResult(percentageResult);
    } else if (value === '+/-') {
      if (input) {
        const toggledInput = input.startsWith('-') ? input.slice(1) : `-${input}`;
        setInput(toggledInput);
        setResult(evaluateExpression(toggledInput));
      }
    } else if (value === '()') {
      const newInput = input + (openParentheses ? '(' : ')');
      setInput(newInput);
      setOpenParentheses(!openParentheses);
    } else {
      const newInput = input + value;
      setInput(newInput);

      // Show live result only if the input doesn't end with an operator
      const endsWithOperator = /[+\-*/]$/.test(newInput);
      if (!endsWithOperator) {
        const liveResult = evaluateExpression(newInput);
        setResult(liveResult);
      } else {
        setResult('');
      }
    }
  };

  const handleHistoryClick = (historyItem) => {
    const [_, historyValue] = historyItem.split(' = '); // Extract the result
    const endsWithOperator = /[+\-*/]$/.test(input);

    // Append the history value to the current input if it ends with an operator
    const newInput = endsWithOperator ? input + historyValue : historyValue;
    setInput(newInput);

    // Calculate live result
    const liveResult = evaluateExpression(newInput);
    setResult(liveResult);
    setShowHistory(false);
  };

  const buttons = [
    'C', '()', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '+/-', '0', '.', '='
  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg max-w-sm mx-auto relative">
      {/* Display */}
      <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
        <div className="text-gray-500 text-sm">{input || '0'}</div>
        <div className="text-black text-xl font-bold">{result || '0'}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button) => (
          <button
            key={button}
            onClick={() => handleButtonClick(button)}
            className={`p-4 rounded-lg text-white font-bold text-lg shadow-md ${
              button === '='
                ? 'bg-green-500 hover:bg-green-600'
                : button === 'C'
                ? 'bg-red-500 hover:bg-red-600'
                : ['/', '*', '-', '+', '%', '()', '+/-'].includes(button)
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          >
            {button}
          </button>
        ))}
      </div>

      {/* History Button */}
      <button
        onClick={() => setShowHistory(true)}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
      >
        View History
      </button>

      {/* History Modal */}
      {showHistory && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80 flex justify-center items-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-center">History</h3>
            <ul className="text-sm max-h-48 overflow-y-auto">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <li
                    key={index}
                    className="border-b py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleHistoryClick(item)}
                  >
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center">No history yet</li>
              )}
            </ul>
            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
