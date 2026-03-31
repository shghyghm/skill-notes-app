from fastapi import FastAPI, Depends, HTTPException, status , Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database, crud, schemas, auth

app = FastAPI()

# Add CORS middleware FIRST (before any routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables on startup
@app.on_event("startup")
def startup():
    try:
        models.Base.metadata.create_all(bind=database.engine)
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    return crud.create_user(db, user.username, user.email, user.password)


@app.post("/login", response_model=schemas.Token)
def login(form_data: schemas.LoginCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.email)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    payload = auth.decode_access_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/skills/", response_model=schemas.SkillOut)
def add_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud.create_skill(db, user_id=current_user.id, title=skill.title)

@app.get("/skills/", response_model=list[schemas.SkillOut])
def list_skills(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud.get_skills(db, user_id=current_user.id)

@app.post("/skills/{skill_id}/notes/", response_model=schemas.NoteOut)
def add_note(skill_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    skill = crud.get_skill(db, skill_id, current_user.id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return crud.create_note(db, skill_id=skill.id, content=note.content)

@app.get("/skills/{skill_id}/notes/", response_model=list[schemas.NoteOut])
def list_notes(skill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    skill = crud.get_skill(db, skill_id, current_user.id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return crud.get_notes(db, skill_id=skill.id)

@app.put("/skills/{skill_id}/", response_model=schemas.SkillOut)
def update_skill(skill_id: int, skill: schemas.SkillCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    updated_skill = crud.update_skill(db, skill_id, current_user.id, skill.title)
    if not updated_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return updated_skill

@app.delete("/skills/{skill_id}/")
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    deleted_skill = crud.delete_skill(db, skill_id, current_user.id)
    if not deleted_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted"}

@app.put("/skills/{skill_id}/notes/{note_id}/", response_model=schemas.NoteOut)
def update_note(skill_id: int, note_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    updated_note = crud.update_note(db, note_id, skill_id, current_user.id, note.content)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note

@app.delete("/skills/{skill_id}/notes/{note_id}/")
def delete_note(skill_id: int, note_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    deleted_note = crud.delete_note(db, note_id, skill_id, current_user.id)
    if not deleted_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted"}

