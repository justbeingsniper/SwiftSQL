import React, { useState } from "react";
import "./NTS.css";
import { Link } from "react-router-dom";

function NTS() {
  const [query, setQuery] = useState('');
  const [generatedSQL, setGeneratedSQL] = useState('');

  const handleConvert = async () => {
    if (!query.trim()) {
      alert("Please enter a query first!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_query: query }), // ✅ match FastAPI model
      });

      const data = await response.json(); // Always parse before checking response.ok

      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.detail || 'Unknown server error');
      }

      setGeneratedSQL(data.sql_query); // ✅ must match FastAPI return shape
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed: ' + error.message);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"
        rel="stylesheet"
      />
      <div className="app-container">
        <header className="nav-header">
          <h1 className="logo">SwiftSQL</h1>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/nts" className="nav-link">Convert NL to SQL</Link>
          </nav>
        </header>

        <main className="main2-content">
          <section className="query-section">
            <h2 className="section-title">Enter your natural language query:</h2>
            <div className="input-container">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Show me all users who registered in 2023"
                className="textarea-input"
              />
            </div>

            <button className="convert-button" onClick={handleConvert}>
              Convert
            </button>
          </section>

          <section className="output-section">
            <h2 className="section-title">Generated SQL Query:</h2>
            <div className="output-container">
              <div className="output-field">
                <code className="sql-query">
                  {generatedSQL || "Your SQL will appear here after conversion."}
                </code>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default NTS;
