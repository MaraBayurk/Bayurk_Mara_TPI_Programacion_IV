
from sqlmodel import SQLModel


class TokenResponse(SQLModel):
    message: str
