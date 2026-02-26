from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Flight(Base):
    __tablename__="flights"
    
    flight_id = Column(String, primary_key=True)
    airline = Column(String)
    origin = Column(String)
    destination = Column(String)
    price = Column(Integer)
    date = Column(String)
    