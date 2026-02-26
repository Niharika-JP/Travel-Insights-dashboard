import random
from database import SessionLocal
from models import Flight

def seed_data():
    session = SessionLocal()

    if session.query(Flight).count() == 0:

        airlines = ["Delta", "United", "American", "Southwest", "JetBlue"]
        cities = ["JFK", "LAX", "SFO", "ORD", "ATL", "SEA", "DEN", "MIA"]

        flights = []

        for i in range(1, 101):   # generates 100 flights
            flight = Flight(
                flight_id=f"F{i:03}",
                airline=random.choice(airlines),
                origin=random.choice(cities),
                destination=random.choice(cities),
                price=random.randint(120, 600),
                date=f"2026-06-{random.randint(1,28):02}"
            )
            flights.append(flight)

        session.add_all(flights)
        session.commit()

    session.close()


def get_all_flights():
    session = SessionLocal()
    flights = session.query(Flight).all()
    session.close()
    return flights


def calculate_revenue():
    session = SessionLocal()
    flights = session.query(Flight).all()
    total = sum(f.price for f in flights)
    session.close()
    return total

def get_flights_by_airline(airline_name):
    session = SessionLocal()
    flights = session.query(Flight).filter(Flight.airline == airline_name).all()
    session.close()
    return flights

def revenue_by_airline():
    session = SessionLocal()
    flights = session.query(Flight).all()
    
    revenue_map = {}
    
    for f in flights:
        revenue_map[f.airline] = revenue_map.get(f.airline, 0) + f.price
        
    session.close()
    
    return sorted(revenue_map.items(), key=lambda x: x[1], reverse = True)


