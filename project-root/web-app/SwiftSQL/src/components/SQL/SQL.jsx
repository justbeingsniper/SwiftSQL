import React, { useState, useEffect, useRef } from "react";
import "./SQL.css";
import { Link } from "react-router-dom";

// Mock database structure and data
const initialDatabase = {
  users: {
    columns: ["id", "name", "email", "created_at"],
    data: [
      [1, "John Doe", "john@example.com", "2023-01-15"],
      [2, "Jane Smith", "jane@example.com", "2023-02-20"],
      [3, "Bob Johnson", "bob@example.com", "2023-03-10"],
    ],
  },
  products: {
    columns: ["id", "name", "price", "stock"],
    data: [
      [1, "Laptop", 1200.0, 10],
      [2, "Smartphone", 800.0, 15],
      [3, "Tablet", 400.0, 20],
      [4, "Headphones", 100.0, 30],
    ],
  },
  orders: {
    columns: ["id", "user_id", "product_id", "quantity", "order_date"],
    data: [
      [1, 1, 2, 1, "2023-04-05"],
      [2, 2, 1, 1, "2023-04-10"],
      [3, 3, 4, 2, "2023-04-15"],
      [4, 1, 3, 1, "2023-04-20"],
    ],
  },
};

const SQL = () => {
  const [databases, setDatabases] = useState({ test: initialDatabase });
  const [currentDb, setCurrentDb] = useState("test");
  const [terminalOutput, setTerminalOutput] = useState([
    { type: "system", content: "Welcome to MySQL Web Clone 1.0.0" },
    { type: "system", content: 'Type "help" for available commands.' },
  ]);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeTable, setActiveTable] = useState(null);
  const [tableView, setTableView] = useState(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const addToTerminal = (content, type = "output") => {
    setTerminalOutput((prev) => [...prev, { type, content }]);
  };

  const executeQuery = (q = query) => {
    if (!q.trim()) return;

    // Add to history
    if (query.trim()) {
      setHistory((prev) => [query, ...prev]);
    }

    addToTerminal(q, "command");

    // Process the query
    try {
      const result = processQuery(q);
      if (result) {
        addToTerminal(result);
      }
    } catch (error) {
      addToTerminal(`ERROR: ${error.message}`, "error");
    }

    setQuery("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeQuery();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory("down");
    }
  };

  const navigateHistory = (direction) => {
    if (history.length === 0) return;

    let newIndex = historyIndex;

    if (direction === "up") {
      if (newIndex < history.length - 1) {
        newIndex++;
      }
    } else if (direction === "down") {
      if (newIndex > -1) {
        newIndex--;
      }
    }

    setHistoryIndex(newIndex);
    if (newIndex >= 0 && newIndex < history.length) {
      setQuery(history[newIndex]);
    } else if (newIndex === -1) {
      setQuery("");
    }
  };

  const processQuery = (q) => {
    const cleanQuery = q.trim().toLowerCase();

    // Help command
    if (cleanQuery === "help") {
      return `
Available commands:
- SHOW DATABASES;
- USE [database_name];
- SHOW TABLES;
- DESCRIBE [table_name];
- SELECT * FROM [table_name];
- SELECT [column1, column2, ...] FROM [table_name] WHERE [condition];
- INSERT INTO [table_name] (column1, column2, ...) VALUES (value1, value2, ...);
- UPDATE [table_name] SET [column1 = value1, ...] WHERE [condition];
- DELETE FROM [table_name] WHERE [condition];
- CREATE DATABASE [database_name];
- CREATE TABLE [table_name] (column1 datatype, column2 datatype, ...);
`;
    }

    // Show databases
    if (cleanQuery === "show databases;") {
      setTableView(null);
      const dbList = Object.keys(databases);
      setTableView({
        columns: ["Database"],
        data: dbList.map((db) => [db]),
      });
      return `Databases: ${dbList.join(", ")}`;
    }

    // Use database
    if (cleanQuery.startsWith("use ")) {
      const dbName = cleanQuery.replace("use ", "").replace(";", "").trim();
      if (databases[dbName]) {
        setCurrentDb(dbName);
        setActiveTable(null);
        return `Database changed to ${dbName}`;
      } else {
        throw new Error(`Database '${dbName}' doesn't exist`);
      }
    }

    // Show tables
    if (cleanQuery === "show tables;") {
      if (!currentDb) throw new Error("No database selected");

      const tablesList = Object.keys(databases[currentDb]);
      setTableView({
        columns: ["Tables in " + currentDb],
        data: tablesList.map((table) => [table]),
      });
      return `Tables in ${currentDb}: ${tablesList.join(", ")}`;
    }

    // Describe table
    if (cleanQuery.startsWith("describe ") || cleanQuery.startsWith("desc ")) {
      if (!currentDb) throw new Error("No database selected");

      const tableName = cleanQuery
        .replace("describe ", "")
        .replace("desc ", "")
        .replace(";", "")
        .trim();

      if (!databases[currentDb][tableName]) {
        throw new Error(`Table '${tableName}' doesn't exist`);
      }

      const columns = databases[currentDb][tableName].columns;
      setTableView({
        columns: ["Field", "Type"],
        data: columns.map((col) => [col, inferType(col, tableName)]),
      });

      return `Table structure for '${tableName}'`;
    }

    // Select query
    if (cleanQuery.startsWith("select ")) {
      if (!currentDb) throw new Error("No database selected");

      // Very simple select parser
      const fromIndex = cleanQuery.indexOf("from");
      if (fromIndex === -1)
        throw new Error("Invalid SELECT query, missing FROM clause");

      const selectPart = cleanQuery.substring(6, fromIndex).trim();
      let whereIndex = cleanQuery.indexOf("where");
      let tablePart;

      if (whereIndex === -1) {
        tablePart = cleanQuery
          .substring(fromIndex + 4)
          .replace(";", "")
          .trim();
      } else {
        tablePart = cleanQuery.substring(fromIndex + 4, whereIndex).trim();
      }

      if (!databases[currentDb][tablePart]) {
        throw new Error(`Table '${tablePart}' doesn't exist`);
      }

      const tableData = databases[currentDb][tablePart];
      let result;

      if (selectPart === "*") {
        // Select all columns
        result = {
          columns: tableData.columns,
          data: tableData.data,
        };
      } else {
        // Select specific columns
        const selectedColumns = selectPart.split(",").map((col) => col.trim());
        const columnIndices = selectedColumns.map((col) => {
          const index = tableData.columns.indexOf(col);
          if (index === -1) throw new Error(`Column '${col}' doesn't exist`);
          return index;
        });

        result = {
          columns: selectedColumns,
          data: tableData.data.map((row) =>
            columnIndices.map((index) => row[index])
          ),
        };
      }

      // Handle WHERE clause (very basic implementation)
      if (whereIndex !== -1) {
        const wherePart = cleanQuery
          .substring(whereIndex + 5)
          .replace(";", "")
          .trim();

        // Very simple condition parser (only supports equality)
        const [column, value] = wherePart.split("=").map((part) => part.trim());
        const columnIndex = tableData.columns.indexOf(column);

        if (columnIndex === -1)
          throw new Error(`Column '${column}' doesn't exist`);

        // Remove quotes if present
        const searchValue = value.replace(/['"]/g, "");

        result.data = result.data.filter((row) => {
          const fullRow =
            tableData.data[tableData.data.findIndex((r) => r.includes(row[0]))];
          return String(fullRow[columnIndex]) === searchValue;
        });
      }

      setActiveTable(tablePart);
      setTableView(result);
      return `Query executed, ${result.data.length} rows returned`;
    }

    // Insert query
    if (cleanQuery.startsWith("insert into ")) {
      if (!currentDb) throw new Error("No database selected");

      const match = cleanQuery.match(
        /insert into (\w+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i
      );
      if (!match) throw new Error("Invalid INSERT query syntax");

      const [, tableName, columnsStr, valuesStr] = match;

      if (!databases[currentDb][tableName]) {
        throw new Error(`Table '${tableName}' doesn't exist`);
      }

      const tableData = databases[currentDb][tableName];
      const columns = columnsStr.split(",").map((col) => col.trim());

      // Parse values, handling quotes
      const values = [];
      let currentValue = "";
      let inQuotes = false;
      let quoteChar = "";

      for (let i = 0; i < valuesStr.length; i++) {
        const char = valuesStr[i];

        if (
          (char === "'" || char === '"') &&
          (!inQuotes || char === quoteChar)
        ) {
          inQuotes = !inQuotes;
          quoteChar = inQuotes ? char : "";
          if (!inQuotes) {
            // Don't include the quotes in the value
            values.push(currentValue);
            currentValue = "";
          }
        } else if (char === "," && !inQuotes) {
          if (currentValue.trim()) {
            values.push(currentValue.trim());
          }
          currentValue = "";
        } else if (inQuotes || (char !== " " && char !== ",")) {
          currentValue += char;
        }
      }

      if (currentValue.trim()) {
        values.push(currentValue.trim());
      }

      // Convert values to appropriate types
      const processedValues = values.map((val) => {
        if (!isNaN(Number(val))) return Number(val);
        return val;
      });

      // Create a new row with default values
      const newRow = Array(tableData.columns.length).fill(null);

      // Set values for specified columns
      columns.forEach((col, index) => {
        const colIndex = tableData.columns.indexOf(col);
        if (colIndex === -1) throw new Error(`Column '${col}' doesn't exist`);
        newRow[colIndex] = processedValues[index];
      });

      // Generate a new ID if not provided
      if (tableData.columns.includes("id") && !columns.includes("id")) {
        const idIndex = tableData.columns.indexOf("id");
        newRow[idIndex] =
          Math.max(...tableData.data.map((row) => row[idIndex]), 0) + 1;
      }

      // Add the new row
      const newData = [...databases[currentDb][tableName].data, newRow];

      // Update the database
      setDatabases({
        ...databases,
        [currentDb]: {
          ...databases[currentDb],
          [tableName]: {
            ...databases[currentDb][tableName],
            data: newData,
          },
        },
      });

      return `Query OK, 1 row inserted`;
    }

    // Update query
    if (cleanQuery.startsWith("update ")) {
      if (!currentDb) throw new Error("No database selected");

      const updateMatch = cleanQuery.match(
        /update (\w+) set (.+?) where (.+)/i
      );
      if (!updateMatch) throw new Error("Invalid UPDATE query syntax");

      const [, tableName, setPart, wherePart] = updateMatch;

      if (!databases[currentDb][tableName]) {
        throw new Error(`Table '${tableName}' doesn't exist`);
      }

      const tableData = databases[currentDb][tableName];

      // Parse SET clause
      const setItems = setPart.split(",").map((item) => {
        const [column, value] = item.split("=").map((part) => part.trim());
        // Remove quotes if present
        const cleanValue = value.replace(/^['"](.+)['"]$/, "$1");
        return { column, value: cleanValue };
      });

      // Parse WHERE clause (simple version)
      const [whereColumn, whereValue] = wherePart
        .replace(";", "")
        .split("=")
        .map((part) => part.trim());
      const whereColIndex = tableData.columns.indexOf(whereColumn);
      if (whereColIndex === -1)
        throw new Error(`Column '${whereColumn}' doesn't exist`);

      // Remove quotes if present
      const cleanWhereValue = whereValue.replace(/^['"](.+)['"]$/, "$1");

      // Update matching rows
      let updatedCount = 0;
      const newData = tableData.data.map((row) => {
        if (String(row[whereColIndex]) === cleanWhereValue) {
          updatedCount++;
          const updatedRow = [...row];

          setItems.forEach(({ column, value }) => {
            const colIndex = tableData.columns.indexOf(column);
            if (colIndex === -1)
              throw new Error(`Column '${column}' doesn't exist`);

            // Convert to appropriate type
            updatedRow[colIndex] = !isNaN(Number(value))
              ? Number(value)
              : value;
          });

          return updatedRow;
        }
        return row;
      });

      // Update the database
      setDatabases({
        ...databases,
        [currentDb]: {
          ...databases[currentDb],
          [tableName]: {
            ...databases[currentDb][tableName],
            data: newData,
          },
        },
      });

      return `Query OK, ${updatedCount} row${
        updatedCount !== 1 ? "s" : ""
      } affected`;
    }

    // Delete query
    if (cleanQuery.startsWith("delete from ")) {
      if (!currentDb) throw new Error("No database selected");

      const deleteMatch = cleanQuery.match(/delete from (\w+)( where (.+))?/i);
      if (!deleteMatch) throw new Error("Invalid DELETE query syntax");

      const [, tableName, , wherePart] = deleteMatch;

      if (!databases[currentDb][tableName]) {
        throw new Error(`Table '${tableName}' doesn't exist`);
      }

      const tableData = databases[currentDb][tableName];

      if (!wherePart) {
        // Delete all rows
        const rowCount = tableData.data.length;

        setDatabases({
          ...databases,
          [currentDb]: {
            ...databases[currentDb],
            [tableName]: {
              ...databases[currentDb][tableName],
              data: [],
            },
          },
        });

        return `Query OK, ${rowCount} row${rowCount !== 1 ? "s" : ""} affected`;
      } else {
        // Parse WHERE clause
        const [whereColumn, whereValue] = wherePart
          .replace(";", "")
          .split("=")
          .map((part) => part.trim());
        const whereColIndex = tableData.columns.indexOf(whereColumn);
        if (whereColIndex === -1)
          throw new Error(`Column '${whereColumn}' doesn't exist`);

        // Remove quotes if present
        const cleanWhereValue = whereValue.replace(/^['"](.+)['"]$/, "$1");

        // Delete matching rows
        const originalLength = tableData.data.length;
        const newData = tableData.data.filter(
          (row) => String(row[whereColIndex]) !== cleanWhereValue
        );
        const deletedCount = originalLength - newData.length;

        setDatabases({
          ...databases,
          [currentDb]: {
            ...databases[currentDb],
            [tableName]: {
              ...databases[currentDb][tableName],
              data: newData,
            },
          },
        });

        return `Query OK, ${deletedCount} row${
          deletedCount !== 1 ? "s" : ""
        } affected`;
      }
    }

    // Create database
    if (cleanQuery.startsWith("create database ")) {
      const dbName = cleanQuery
        .replace("create database ", "")
        .replace(";", "")
        .trim();

      if (databases[dbName]) {
        throw new Error(`Database '${dbName}' already exists`);
      }

      setDatabases({
        ...databases,
        [dbName]: {},
      });

      return `Database '${dbName}' created`;
    }

    // Create table
    if (cleanQuery.startsWith("create table ")) {
      if (!currentDb) throw new Error("No database selected");

      // Very basic implementation
      const match = cleanQuery.match(/create table (\w+)\s*\((.+)\)/i);
      if (!match) throw new Error("Invalid CREATE TABLE syntax");

      const [, tableName, columnsStr] = match;

      if (databases[currentDb][tableName]) {
        throw new Error(`Table '${tableName}' already exists`);
      }

      // Parse columns (very simple implementation)
      const columnsDefinitions = columnsStr.split(",").map((col) => col.trim());
      const columns = columnsDefinitions.map((def) => def.split(" ")[0]);

      setDatabases({
        ...databases,
        [currentDb]: {
          ...databases[currentDb],
          [tableName]: {
            columns,
            data: [],
          },
        },
      });

      return `Table '${tableName}' created`;
    }

    // If we got here, command not recognized
    throw new Error(`Unknown command: ${q}`);
  };

  // Utility to infer data types
  const inferType = (column, tableName) => {
    if (!currentDb || !databases[currentDb][tableName]) return "VARCHAR";

    const table = databases[currentDb][tableName];
    const columnIndex = table.columns.indexOf(column);

    if (columnIndex === -1) return "VARCHAR";

    // Check first row with data
    for (const row of table.data) {
      const value = row[columnIndex];
      if (value !== null && value !== undefined) {
        if (typeof value === "number") {
          return Number.isInteger(value) ? "INT" : "DECIMAL";
        } else if (typeof value === "string") {
          if (value.match(/^\d{4}-\d{2}-\d{2}$/)) return "DATE";
          return "VARCHAR";
        }
      }
    }

    return "VARCHAR";
  };

  return (
    <div className="mysql-clone-container">
      <div className="header">
        <h1>DataBase Management</h1>
        <div className="db-info">
          <Link to="/">Home</Link>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="db-explorer">
            <h3>Databases</h3>
            <ul>
              {Object.keys(databases).map((db) => (
                <li
                  key={db}
                  className={db === currentDb ? "active" : ""}
                  onClick={() => {
                    setCurrentDb(db);
                    addToTerminal(`USE ${db};`, "command");
                    addToTerminal(`Database changed to ${db}`);
                  }}
                >
                  <span className="db-name">{db}</span>
                  {db === currentDb && (
                    <ul className="tables-list">
                      {databases[db] &&
                        Object.keys(databases[db]).map((table) => (
                          <li
                            key={table}
                            className={activeTable === table ? "active" : ""}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTable(table);
                              const cmd = `SELECT * FROM ${table};`;
                              addToTerminal(cmd, "command");
                              processQuery(cmd);
                            }}
                          >
                            {table}
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="content-area">
          <div className="terminal" ref={terminalRef}>
            {terminalOutput.map((line, index) => (
              <div key={index} className={`terminal-line ${line.type}`}>
                {line.type === "command" ? "> " : ""}
                {line.content}
              </div>
            ))}
          </div>

          <div className="query-box">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter SQL query..."
              rows={4}
            />
            <button onClick={() => executeQuery()}>Execute</button>
          </div>

          {tableView && (
            <div className="table-viewer">
              <h3>{activeTable ? `Table: ${activeTable}` : "Query Result"}</h3>
              <table>
                <thead>
                  <tr>
                    {tableView.columns.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableView.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>
                          {cell !== null ? String(cell) : "NULL"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {tableView.data.length === 0 && (
                    <tr>
                      <td
                        colSpan={tableView.columns.length}
                        className="empty-table"
                      >
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SQL;
