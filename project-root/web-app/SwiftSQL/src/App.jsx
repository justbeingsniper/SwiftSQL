import React from "react";
import Full from "./components/Full";
import Login from "./components/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Features from "./components/Features/Features";
import NTS from "./components/NLP-to-SQL/NTS";
import ETD from "./components/ER-to-DS/ETD";
import SQL from "./components/SQL/SQL";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Full />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feature" element={<Features />}></Route>
        <Route path="/nts" element={<NTS />}></Route>
        <Route path="/etd" element={<ETD />}></Route>
        <Route path="/sql" element={<SQL />}></Route>
        
      </Routes>
    </Router>
  );
}

export default App;
