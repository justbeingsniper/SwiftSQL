# SwiftSQL

SwiftSQL is a full-stack AI-powered application that translates natural language queries and ER diagrams into executable SQL queries. It combines deep learning models, a FastAPI inference service, a React frontend, and a Node.js backend with MySQL for seamless query generation, execution, and user session management.

---

## Features

- Natural Language to SQL conversion via a sequence-to-sequence (LSTM) model.
- ER diagram parsing and conversion to database schema.
- Real-time SQL generation through FastAPI inference server.
- Interactive query and result interface built with React.
- Secure session-based login and SQL execution via Node.js and MySQL.
- Clean modular structure separating frontend, backend, and model layers.

---

## Tech Stack

| Layer         | Technology                                                    |
|---------------|---------------------------------------------------------------|
| Frontend      | React.js (Vite), HTML, CSS                                    |
| Backend       | Node.js, Express.js, MySQL                                    |
| Model Server  | FastAPI, TensorFlow, Pickle                                   |
| Model Type    | Sequence-to-Sequence (Encoder–Decoder) with LSTM              |
| Auth System   | Express Sessions                                              |
| Tokenization  | HuggingFace-style preprocessing with pickled tokenizers       |

---

## Folder Structure

```
SwiftSQL/
├── fastapi-backend/       # FastAPI server for model inference
├── backend/               # Node.js backend with API and authentication
├── web-app/               # React-based frontend interface
├── LocalModel/            # Trained models and preprocessing tokenizers
│   ├── encoder_model.h5
│   ├── decoder_model.h5
│   ├── input_tokenizer.pkl
│   ├── target_tokenizer.pkl
│   ├── Max_lengths.pkl
│   └── sequence_params.pkl
├── app.py, utils.py       # Prediction logic for FastAPI server
├── server.js              # Express routes for login and SQL execution
├── Untitled.mdj           # (Optional) UML/ER diagram
├── package.json           # Project dependencies and metadata
└── .gitignore
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/justbeingsniper/SwiftSQL.git
cd SwiftSQL
```

---

### 2. Set Up the FastAPI Server

```bash
cd fastapi-backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

> Ensure the following model files exist in `fastapi-backend/models/`:

- encoder_model.h5  
- decoder_model.h5  
- input_tokenizer.pkl  
- target_tokenizer.pkl  
- Max_lengths.pkl

---

### 3. Set Up Node.js Backend

```bash
cd ../backend
npm install
node server.js
```

Create a `.env` file in the `backend/` directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
```

---

### 4. Start the React Frontend

```bash
cd ../web-app
npm install
npm run dev
```

Runs at `http://localhost:5173`.

---

## API Endpoints

### FastAPI (localhost:8000)

- `POST /generate-sql` — Converts natural language to SQL.

### Node.js (localhost:5000)

- `POST /api/login` — User authentication.
- `GET /api/databases` — Lists MySQL databases.
- `POST /api/execute` — Executes a raw SQL query.

---

## Example Usage

> User query:  
> _"Show all customers who placed more than 3 orders in the last month."_

**Workflow:**

1. React app sends query to FastAPI.
2. FastAPI returns SQL:  
   `SELECT * FROM customers WHERE order_count > 3 AND order_date >= CURDATE() - INTERVAL 1 MONTH;`
3. Node.js backend executes SQL and returns results to frontend.

---

## License

This project is currently unlicensed. You may add a `LICENSE` file for distribution terms.

---

## Acknowledgements

- TensorFlow, Keras — Deep Learning Framework
- FastAPI + Uvicorn — Python-based model serving
- React + Vite — Frontend interface
- Express.js + MySQL — Backend and database layer
- Spider and WikiSQL — NLP-SQL training datasets

---

## Author

Developed by [justbeingsniper](https://github.com/justbeingsniper)
