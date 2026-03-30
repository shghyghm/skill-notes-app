from sqlalchemy.orm import Session
from datetime import datetime
from . import models, auth

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, username: str, email: str, password: str):
    hashed_password = auth.hash_password(password)
    db_user = models.User(username=username, email=email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Skill ---
def create_skill(db, user_id: int, title: str):
    skill = models.Skill(title=title, owner_id=user_id)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

def get_skills(db, user_id: int):
    return db.query(models.Skill).filter(models.Skill.owner_id == user_id).all()

def get_skill(db, skill_id: int, user_id: int):
    return db.query(models.Skill).filter(models.Skill.id == skill_id, models.Skill.owner_id == user_id).first()

# --- Note ---
def create_note(db, skill_id: int, content: str):
    note = models.Note(skill_id=skill_id, content=content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

def get_notes(db, skill_id: int):
    return db.query(models.Note).filter(models.Note.skill_id == skill_id).all()

# --- Update/Delete ---
def update_skill(db, skill_id: int, user_id: int, title: str):
    skill = get_skill(db, skill_id, user_id)
    if skill:
        skill.title = title
        db.commit()
        db.refresh(skill)
    return skill

def delete_skill(db, skill_id: int, user_id: int):
    skill = get_skill(db, skill_id, user_id)
    if skill:
        db.delete(skill)
        db.commit()
    return skill

def update_note(db, note_id: int, skill_id: int, user_id: int, content: str):
    note = db.query(models.Note).join(models.Skill).filter(
        models.Note.id == note_id,
        models.Note.skill_id == skill_id,
        models.Skill.owner_id == user_id
    ).first()
    if note:
        note.content = content
        note.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(note)
    return note

def delete_note(db, note_id: int, skill_id: int, user_id: int):
    note = db.query(models.Note).join(models.Skill).filter(
        models.Note.id == note_id,
        models.Note.skill_id == skill_id,
        models.Skill.owner_id == user_id
    ).first()
    if note:
        db.delete(note)
        db.commit()
    return note