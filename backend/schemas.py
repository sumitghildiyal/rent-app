from pydantic import BaseModel
from typing import Optional

class RentRecordBase(BaseModel):
    floor_no: int
    amount: float
    date: str
    mode: str
    description: Optional[str] = None

class RentRecordCreate(RentRecordBase):
    pass

class RentRecordOut(RentRecordBase):
    id: int

    class Config:
        orm_mode = True
