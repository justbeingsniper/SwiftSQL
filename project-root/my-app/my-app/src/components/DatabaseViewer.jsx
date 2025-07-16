import React from "react";

const DatabaseViewer = ({ databases, selectedDatabase, setSelectedDatabase, onCreateDatabase }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Databases</h3>

      <button
        onClick={onCreateDatabase}
        className="mb-2 bg-green-600 text-white px-3 py-1 rounded w-full"
      >
        + Create Database
      </button>

      <select
        value={selectedDatabase}
        onChange={(e) => setSelectedDatabase(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="" disabled>Select a database</option>
        {databases.map((db, idx) => (
          <option key={idx} value={db}>
            {db}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatabaseViewer;
