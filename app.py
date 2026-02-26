from flask import Flask, jsonify, request
from services import seed_data, get_all_flights, calculate_revenue, get_flights_by_airline
from services import revenue_by_airline 
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

seed_data()


@app.route("/api/flights", methods=["GET"])
def flights():
    airline = request.args.get("airline")

    if airline:
        flights = get_flights_by_airline(airline)
    else:
        flights = get_all_flights()

    result = [
        {
            "flight_id": f.flight_id,
            "airline": f.airline,
            "origin": f.origin,
            "destination": f.destination,
            "price": f.price,
            "date": f.date
        }
        for f in flights
    ]

    return jsonify(result)


@app.route("/api/revenue", methods=["GET"])
def revenue():
    return jsonify({
        "total_revenue": calculate_revenue()
    })


@app.route("/api/analytics", methods=["GET"])
def analytics():
    flights = get_all_flights()
    revenue = calculate_revenue()

    avg_price = revenue / len(flights) if flights else 0

    return jsonify({
        "total_flights": len(flights),
        "total_revenue": revenue,
        "average_ticket_price": avg_price
    })

@app.route("/api/top-airlines")
def top_airlines():
    data = revenue_by_airline()
    
    return jsonify([
        {"airline": airline, "revenue": revenue}
        for airline, revenue in data
    ])
if __name__ == "__main__":
    app.run(debug=True) 
    
