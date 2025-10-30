from sqlalchemy import Column, Integer, String, Float, Date
from database import Base


class RentRecord(Base):
    __tablename__ = "rent_records"

    id = Column(Integer, primary_key=True, index=True)
    floor_no = Column(Integer)
    amount = Column(Float)
    date = Column(String)
    mode = Column(String)
    description = Column(String)
