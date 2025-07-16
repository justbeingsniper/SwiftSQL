import * as React from "react";
import "./ETD.css";
import { Link } from "react-router-dom";

function ETD() {
  return (
    <>
      <nav className="navigation-header">
        <div className="brand-container">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/33d35fd35cf6810fe1c1dca6c8ee1b1abbda65b9?placeholderIfAbsent=true"
            alt="Logo"
            className="brand-logo"
          />
          <h1 className="brand-title">DB Converter</h1>
        </div>
        <div className="nav-links">
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </div>
      </nav>
      <div classNameName="app-container">
        <section className="upload-container">
          <h2 className="upload-title">ER Diagram Input</h2>
          <div className="upload-area">
            <button className="upload-button" aria-label="Upload ER Diagram Image">
              Upload Image
            </button>
          </div>
        </section>

        <section className="database-output">
          <header>
            <h2 className="database-output__title">Database Output</h2>
          </header>
          <div className="database-output__content">
            <table className="database-output__table" role="grid">
              <thead>
                <tr className="database-output__row">
                  <th className="database-output__header" scope="col">
                    Table Name
                  </th>
                  <th className="database-output__header" scope="col">
                    Column Name
                  </th>
                  <th className="database-output__header" scope="col">
                    Data Type
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="database-output__row">
                  <td className="database-output__cell">Customers</td>
                  <td className="database-output__cell">CustomerID</td>
                  <td className="database-output__cell">INT</td>
                </tr>
                <tr className="database-output__row">
                  <td className="database-output__cell">Customers</td>
                  <td className="database-output__cell">Name</td>
                  <td className="database-output__cell">VARCHAR(100)</td>
                </tr>
                <tr className="database-output__row">
                  <td className="database-output__cell">Orders</td>
                  <td className="database-output__cell">OrderID</td>
                  <td className="database-output__cell">INT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <article className="options-panel">
          <h2 className="options-title">Options</h2>
          <button className="options-button options-button--primary">
            Convert
          </button>
          <button className="options-button options-button--secondary">
            Reset
          </button>
        </article>
      </div>
    </>
  );
}

export default ETD;
