import React, { useState } from 'react';
import axios from 'axios';

const SQLTerminal = () => {
  const [sqlInput, setSqlInput] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [output, setOutput] = useState("");

  const handleCommand = async () => {
    const trimmed = sqlInput.trim();
    const useMatch = trimmed.match(/^USE\s+([a-zA-Z0-9_]+);?$/i);

    if (useMatch) {
      const dbName = useMatch[1];
      setSelectedDatabase(dbName);
      setOutput(`Switched to database: ${dbName}`);
      setSqlInput("");
      return;
    }

    try {
      const response = await axios.post("/run-query", {
        query: trimmed,
        database: selectedDatabase,
      });
      setOutput(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setOutput(err.response?.data?.detail || "Query failed.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex mb-2">
        <input
          type="text"
          value={sqlInput}
          onChange={(e) => setSqlInput(e.target.value)}
          placeholder="Type your SQL command..."
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleCommand}
          className="bg-green-500 p-2 text-white rounded-r hover:bg-green-600"
        >
          Run
        </button>
      </div>
      <div className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap min-h-[100px]">
        {output || "Query output will appear here."}
      </div>
    </div>
  );
};

export default SQLTerminal;
