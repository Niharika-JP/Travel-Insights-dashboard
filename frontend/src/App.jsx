import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:5000/api";

function Card({ title, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      padding: 20,
      borderRadius: 16,
      backdropFilter: "blur(6px)"
    }}>
      <div style={{ opacity: 0.6, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

export default function App() {
  const [flights, setFlights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [topAirlines, setTopAirlines] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const priceBuckets = [
  { range: "<200", count: flights.filter(f => f.price < 200).length },
  { range: "200-400", count: flights.filter(f => f.price >= 200 && f.price < 400).length },
  { range: "400-600", count: flights.filter(f => f.price >= 400 && f.price < 600).length },
  { range: "600+", count: flights.filter(f => f.price >= 600).length }
  ];

  useEffect(() => {
  fetch(`${API_BASE}/flights`)
    .then(res => res.json())
    .then(setFlights)
    .catch(console.error);

  fetch(`${API_BASE}/analytics`)
    .then(res => res.json())
    .then(setAnalytics)
    .catch(console.error);

  fetch(`${API_BASE}/top-airlines`)
    .then(res => res.json())
    .then(setTopAirlines)
    .catch(console.error);
}, []);

const filteredFlights = flights
  .filter(f =>
    f.airline.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  if (!analytics) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "white"
      }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      fontFamily: "system-ui",
      color: "white"
    }}>

      <div style={{ flex: 2, padding: "40px" }}>

        <h1 style={{ fontSize: 36 }}>Travel Insights</h1>
        <div style={{ opacity: 0.6, marginBottom: 30 }}>
          Dashboard Overview
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 30
        }}>

        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <input
            placeholder="Search airline..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
            padding: 10,
            borderRadius: 8,
            border: "none",
            width: 200
            }}
        />

  <select
    value={sortOrder}
    onChange={e => setSortOrder(e.target.value)}
    style={{
      padding: 10,
      borderRadius: 8,
      border: "none"
    }}
  >
    <option value="none">Sort by Price</option>
    <option value="asc">Low → High</option>
    <option value="desc">High → Low</option>
  </select>
</div>
          <Card title="Total Flights">
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {analytics.total_flights}
            </div>
          </Card>

          <Card title="Total Revenue">
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              ${analytics.total_revenue}
            </div>
          </Card>

          <Card title="Avg Ticket Price">
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              ${Math.round(analytics.average_ticket_price)}
            </div>
          </Card>
        </div>

        <Card title="Flights">
          <div style={{ maxHeight: 400, overflow: "auto" }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map(f => (
                  <tr key={f.flight_id}>
                    <td>{f.airline}</td>
                    <td>{f.origin} → {f.destination}</td>
                    <td>${f.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Price Distribution">
  <div style={{ height: 250 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={priceBuckets}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="range" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>

<Card title="Airline Revenue">
  <div style={{ height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={topAirlines}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="airline" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Bar dataKey="revenue" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>

      </div>

      <div style={{
        flex: 1,
        background: "rgba(255,255,255,0.03)",
        padding: "40px",
        borderLeft: "1px solid rgba(255,255,255,0.05)"
      }}>
        <h3>Top Airlines</h3>

        {topAirlines.map(row => (
          <div key={row.airline} style={{
            marginTop: 15,
            padding: 15,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12
          }}>
            <div>{row.airline}</div>
            <div style={{ opacity: 0.6 }}>
              ${row.revenue}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}