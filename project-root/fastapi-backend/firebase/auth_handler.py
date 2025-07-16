from fastapi import HTTPException, Header
from firebase_admin import auth

async def verify_token(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()

        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        decoded_token = auth.verify_id_token(token)
        return {"uid": decoded_token["uid"]}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")
