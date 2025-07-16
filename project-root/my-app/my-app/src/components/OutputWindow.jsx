import React from 'react';

const OutputWindow = ({ output }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Output</h3>
      <pre className="bg-gray-50 p-2 rounded overflow-x-auto">{output}</pre>
    </div>
  );
};

export default OutputWindow;