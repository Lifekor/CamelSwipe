from pydantic import BaseModel


class SignInResponse(BaseModel):
    user_id: str
    role: str
