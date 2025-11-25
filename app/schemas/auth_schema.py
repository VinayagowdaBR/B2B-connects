from pydantic import BaseModel
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    permissions: List[str] = []

class LoginRequest(BaseModel):
    email: str
    password: str
