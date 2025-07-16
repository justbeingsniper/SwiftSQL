# SwiftSQL

SwiftSQL is a full-stack AI-powered application that converts natural language queries and ER diagrams into executable SQL queries. It leverages deep learning models, a React frontend, a FastAPI inference service, and a Node.js backend connected to MySQL for secure user access and dynamic query execution.

## Features

- Natural Language to SQL conversion using a sequence-to-sequence (LSTM) model.
- ER diagram parsing and conversion to SQL structure.
- FastAPI-based model inference server for real-time SQL generation.
- React frontend for interactive user queries and query result display.
- Node.js and Express backend for session-based user authentication and MySQL query execution.
- Modular structure with clear separation between frontend, backend, and model services.

## Tech Stack

| Layer        | Technology                                                   |
|--------------|--------------------------------------------------------------|
| Frontend     | React.js (Vite), HTML, CSS                                   |
| Backend      | Node.js, Express.js, MySQL                                   |
| Model Server | FastAPI (Python), TensorFlow, Pickle                         |
| Model Type   | Sequence-to-Sequence (Encoder–Decoder) with LSTM             |
| Authentication | Express Sessions                                          |
| Tokenizers   | HuggingFace-style preprocessing with pickled token objects   |

## Folder Structure

SwiftSQL/
├── fastapi-backend/ # Model inference API using FastAPI
├── backend/ # Node.js server (API and auth)
├── web-app/ # React frontend UI
├── LocalModel/ # Trained model files and tokenizers
│ ├── encoder_model.h5
│ ├── decoder_model.h5
│ ├── input_tokenizer.pkl
│ ├── target_tokenizer.pkl
│ ├── Max_lengths.pkl
│ └── sequence_params.pkl
├── app.py / utils.py # Model utility logic
├── server.js # Node.js API for login, SQL execution
├── Untitled.mdj # (Optional) ER/UML diagram
├── package.json # Project metadata and dependencies
└── .gitignore




## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/justbeingsniper/SwiftSQL.git
cd SwiftSQL

cd fastapi-backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

cd fastapi-backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

Ensure that the following files exist in fastapi-backend/models/:

encoder_model.h5

decoder_model.h5

input_tokenizer.pkl

target_tokenizer.pkl

Max_lengths.pkl

cd ../backend
npm install
node server.js

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password

cd ../web-app
npm install
npm run dev

API Endpoints
FastAPI (localhost:8000)
POST /generate-sql/ – Accepts a natural language query and returns SQL.

NodeJS (localhost:5000)
POST /api/login – Handles user login.

GET /api/databases – Lists all available databases.

POST /api/execute – Executes a SQL query on the selected database.

Example Use Case
User types a query like:
"Show all customers who placed more than 3 orders in the last month."

→ The model returns a valid SQL query
→ The backend executes it using MySQL
→ The frontend displays the result in a table

License
This project is currently unlicensed. You may add a LICENSE file for distribution guidelines.

Acknowledgements
TensorFlow and Keras for model training

HuggingFace Tokenizers for NLP preprocessing

Uvicorn + FastAPI for Python inference

React and Vite for the frontend

Express, Node.js, and MySQL for backend and data management

WikiSQL and Spider datasets for training data

Author
Developed by justbeingsniper
