from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database, models
from schemas import RentRecordCreate, RentRecordOut

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
database.Base.metadata.create_all(bind=database.engine)

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.get("/records", response_model=list[RentRecordOut])
def get_records(db: Session = Depends(get_db)):
    return db.query(models.RentRecord).all()

@app.post("/records", response_model=RentRecordOut)
def add_record(record: RentRecordCreate, db: Session = Depends(get_db)):
    new_record = models.RentRecord(**record.dict())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@app.put("/records/{record_id}", response_model=RentRecordOut)
def update_record(record_id: int, updated: RentRecordCreate, db: Session = Depends(get_db)):
    record = db.query(models.RentRecord).filter(models.RentRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record
