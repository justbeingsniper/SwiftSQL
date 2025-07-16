import React, { useState } from 'react';
import DatabaseViewer from '../components/DatabaseViewer';
import OutputWindow from '../components/OutputWindow';
import SQLTerminal from '../components/SQLTerminal';
import { fetchDatabases, executeQuery, createDatabase } from '../services/api';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const MySQLClonePage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [output, setOutput] = useState('');
  const [sqlInput, setSqlInput] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Login with Firebase
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseUser', JSON.stringify({ idToken }));
      setLoggedIn(true);
      fetchDatabasesHandler();
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    }
  };

  // Fetch databases
  const fetchDatabasesHandler = async () => {
    try {
      const res = await fetchDatabases();
      const dbList = res.data.databases || []; // ✅ safely access correct property
      setDatabases(dbList);
      if (dbList.length === 1) {
        setSelectedDatabase(dbList[0]); // ✅ now dbList[i] is a string (like "test_db")
      }
    } catch (err) {
      console.error('Fetching databases failed:', err);
      setDatabases([]);
    }
  };
  
  
  // Run SQL command
  const handleCommand = async () => {
    try {
      const res = await executeQuery(sqlInput, selectedDatabase || null);
      setOutput(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('Query execution error:', err);
      setOutput('Error executing query: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Show login screen
  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl mb-4 text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // Main UI
  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-2 h-screen p-2">
      {/* Sidebar */}
      <div className="col-span-1 row-span-5 bg-gray-100 rounded p-2 overflow-y-auto">

      <DatabaseViewer
  databases={databases}
  selectedDatabase={selectedDatabase}
  setSelectedDatabase={setSelectedDatabase}
  onCreateDatabase={async () => {
    const name = prompt("Enter new database name:");
    if (!name) return;
    try {
      await createDatabase(name);
      fetchDatabasesHandler();
    } catch (err) {
      alert("Failed to create DB: " + (err.response?.data?.detail || err.message));
    }
  }}
/>


      </div>

      {/* Output */}
      <div className="col-span-3 row-span-4 bg-white rounded p-2 overflow-y-auto">
        <OutputWindow output={output} />
      </div>

      {/* SQL Terminal */}
      <div className="col-span-3 row-span-1 bg-gray-200 rounded p-2 flex flex-col justify-center">
        <SQLTerminal
          sqlInput={sqlInput}
          setSqlInput={setSqlInput}
          handleCommand={handleCommand}
        />
        <div className="text-sm text-gray-600 mt-1">
          Current Database: <strong>{selectedDatabase || 'None selected'}</strong>
        </div>
      </div>
    </div>
  );
};

export default MySQLClonePage;
