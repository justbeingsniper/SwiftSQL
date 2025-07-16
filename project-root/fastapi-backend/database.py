from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from firebase.auth_handler import verify_token
from connection import get_connection

import re


router = APIRouter()

# --- Pydantic Models ---
class DatabaseRequest(BaseModel):
    name: str

class SQLQueryRequest(BaseModel):
    query: str
    database: str | None = None


# --- Routes ---

@router.get("/databases")
def list_databases(user=Depends(verify_token)):
    if user.get("isGuest"):
        # Return static sample DB for guests
        return [
            {
                "name": "sample_school_db",
                "readonly": True,
                "tables": [
                    {
                        "name": "students",
                        "columns": [
                            {"name": "id", "type": "INT"},
                            {"name": "name", "type": "VARCHAR(100)"},
                            {"name": "age", "type": "INT"},
                            {"name": "grade", "type": "VARCHAR(10)"}
                        ],
                        "rows": [
                            [1, "Alice Johnson", 14, "9"],
                            [2, "Bob Smith", 15, "10"],
                            [3, "Charlie Brown", 13, "8"]
                        ]
                    }
                ]
            }
        ]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT db_name as name FROM user_databases WHERE user_id = %s", (user["uid"],))
        databases = cursor.fetchall()
        for db in databases:
            db["readonly"] = False
        return databases
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@router.post("/create-database")
def create_database(req: DatabaseRequest, user=Depends(verify_token)):
    if user.get("isGuest"):
        raise HTTPException(status_code=403, detail="Guests cannot create databases")

    # Validate DB name
    if not re.fullmatch(r"[a-zA-Z_][a-zA-Z0-9_]*", req.name):
        raise HTTPException(status_code=400, detail="Invalid database name")

    conn = get_connection(database_name=None)
    cursor = conn.cursor()
    try:
        # Create DB and track it
        cursor.execute(f"CREATE DATABASE `{req.name}`")
        cursor.execute(
            "INSERT INTO user_databases (user_id, db_name) VALUES (%s, %s)",
            (user["uid"], req.name)
        )
        conn.commit()
        return {"message": f"Database '{req.name}' created successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@router.post("/run-query")
def run_query(req: SQLQueryRequest, user=Depends(verify_token)):
    if user.get("isGuest"):
        raise HTTPException(status_code=403, detail="Guests cannot run custom SQL queries")

    # Basic SQL command blacklist
    blocked_keywords = ["drop", "delete", "truncate"]
    if any(kw in req.query.lower() for kw in blocked_keywords):
        raise HTTPException(status_code=400, detail="Dangerous commands are not allowed")

    if not req.database:
        raise HTTPException(status_code=400, detail="No database selected")

    # Check database access
    meta_conn = get_connection()
    meta_cursor = meta_conn.cursor()
    try:
        meta_cursor.execute(
            "SELECT 1 FROM user_databases WHERE user_id = %s AND db_name = %s",
            (user["uid"], req.database)
        )
        if not meta_cursor.fetchone():
            raise HTTPException(status_code=403, detail="Unauthorized database access")
    finally:
        meta_cursor.close()
        meta_conn.close()

    # Run query
    conn = get_connection(database_name=req.database)
    cursor = conn.cursor()
    try:
        cursor.execute(req.query)

        if cursor.description:
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            result = [dict(zip(columns, row)) for row in rows]
        else:
            conn.commit()
            result = {"message": "Query executed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

    return result
