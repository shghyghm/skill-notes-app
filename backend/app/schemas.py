from pydantic import BaseModel, EmailStr
from datetime import datetime
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class NoteBase(BaseModel):
    content: str

class NoteCreate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    title: str

class SkillCreate(SkillBase):
    pass

class SkillOut(SkillBase):
    id: int
    notes: list[NoteOut] = []
    class Config:
        from_attributes = True