// backend/server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both frontends if needed
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // should be true in production with HTTPS
}));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

// --- Routes ---

// ✅ Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    await connection.end();

    if (rows.length > 0) {
      req.session.user = username;
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ List Databases
app.get('/api/databases', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SHOW DATABASES');
    await connection.end();

    const databases = rows.map(db => db.Database);
    res.json({ databases });
  } catch (error) {
    console.error('Databases Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Execute SQL
app.post('/api/execute', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');

  const { query } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(query);
    await connection.end();

    res.json({ result });
  } catch (error) {
    console.error('Execute Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// 🚫 REMOVED: /api/convert (no longer needed)
// React now directly calls FastAPI on http://localhost:8000/convert

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
