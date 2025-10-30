from pydantic import BaseModel
from datetime import date

class RentRecordBase(BaseModel):
    floor_no: int
    amount: float
    date: date
    mode: str
    description: str | None = None

class RentRecordCreate(RentRecordBase):
    pass

class RentRecordOut(RentRecordBase):
    id: int

    class Config:
        orm_mode = True
