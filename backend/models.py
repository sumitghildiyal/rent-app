from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class RentRecord(Base):
    __tablename__ = "rent_records"

    id = Column(Integer, primary_key=True, index=True)
    floor_no = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    mode = Column(String, nullable=False)
    description = Column(String, nullable=True)
