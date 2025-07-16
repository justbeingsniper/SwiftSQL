import axios from 'axios';

// Create axios instance with correct FastAPI base URL
const API = axios.create({
  baseURL: 'http://localhost:8000',  // ✅ Use FastAPI backend
  withCredentials: true,
});

// Attach Firebase ID token from localStorage (stored after login)
API.interceptors.request.use(async (config) => {
  const user = window?.localStorage?.getItem("firebaseUser");
  const idToken = user ? JSON.parse(user)?.idToken : null;

  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`;
  }
  return config;
});

// --- API calls ---

// ✅ Fetch databases for authenticated user
export const fetchDatabases = () => API.get('/databases');

// ✅ Create a new database
export const createDatabase = (name) =>
  API.post('/create-db', { db_name: name });

// ✅ Run a query on selected database
export const executeQuery = (query, database = null) =>
  API.post('/run-query', { query, database });

export default API;
