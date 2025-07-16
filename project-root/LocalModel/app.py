from fastapi import FastAPI
from pydantic import BaseModel
from utils import predict_sql  # This should call your model

app = FastAPI()

class QueryRequest(BaseModel):
    question: str

@app.post("/generate-sql/")
def generate_sql(request: QueryRequest):
    sql_query = predict_sql(request.question)
    return {"sql": sql_query}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8500, reload=True)
