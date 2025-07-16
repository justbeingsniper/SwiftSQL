from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from firebase_admin import auth
from firebase.firebase import cred  
from firebase.auth_handler import verify_token
from database import get_connection  # ✅ Make sure this exists

app = FastAPI()

# --- CORS setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- External APIs ---
GROQ_API_KEY = "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"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# --- Models ---
class ConvertRequest(BaseModel):
    user_query: str

class CreateDBRequest(BaseModel):
    db_name: str

class SQLQueryRequest(BaseModel):
    db_name: str
    query: str

# --- Routes ---

@app.post("/convert")
def convert_to_sql(request: ConvertRequest):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are an SQL generator. Convert natural language into SQL queries. Just provide query and nothing else."},
            {"role": "user", "content": request.user_query},
        ],
    }
    response = requests.post(GROQ_URL, headers=headers, json=payload)
    output = response.json()
    sql_query = output['choices'][0]['message']['content']
    
    print("LSTM_Scratch predicted:", sql_query)
    
    return {"sql_query": sql_query}


@app.post("/verify-token/")
async def verify_token_route(request: Request):
    body = await request.json()
    id_token = body.get("idToken")
    if not id_token:
        raise HTTPException(status_code=400, detail="ID token missing")
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        return {"uid": uid, "message": "Token is valid"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")


@app.get("/profile")
async def protected_route(user_data: dict = Depends(verify_token)):
    return {"message": "Authenticated!", "user": user_data}

@app.post("/create_db")
def create_db(data: CreateDBRequest, user=Depends(verify_token)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # First, try creating the actual MySQL database
        cursor.execute(f"CREATE DATABASE `{data.db_name}`")

        # Then log the metadata (only if DB creation succeeded)
        cursor.execute(
            "INSERT INTO user_databases (user_id, db_name) VALUES (%s, %s)",
            (user["uid"], data.db_name)
        )
        conn.commit()

        return {"message": f"Database '{data.db_name}' created for user."}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()



@app.get("/databases")
def list_user_dbs(user=Depends(verify_token)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT db_name FROM user_databases WHERE user_id = %s", (user["uid"],))
        dbs = [row[0] for row in cursor.fetchall()]
        print(f"✅ Databases for user {user['uid']}: {dbs}")
        return {"databases": dbs}  # ✅ Flat array
    except Exception as e:
        print("🔥 Error in /databases:", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()



@app.post("/execute")  # ✅ Match React frontend
def run_user_query(data: SQLQueryRequest, user=Depends(verify_token)):
    # Check if user has access
    meta_conn = get_connection()
    meta_cursor = meta_conn.cursor()
    try:
        meta_cursor.execute(
            "SELECT 1 FROM user_databases WHERE user_id = %s AND db_name = %s",
            (user["uid"], data.db_name)
        )
        if not meta_cursor.fetchone():
            raise HTTPException(status_code=403, detail="Unauthorized database access")
    finally:
        meta_cursor.close()
        meta_conn.close()

    # Execute query
    conn = get_connection(data.db_name)
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(data.query)

        if cursor.with_rows:
            result = cursor.fetchall()
        else:
            conn.commit()
            result = {"rows_affected": cursor.rowcount}

        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()
