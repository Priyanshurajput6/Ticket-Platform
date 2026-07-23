import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import TicketTable from "../components/TicketTable";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5243/api/Tickets/my-tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to load tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const wipTickets = tickets.filter((t) => t.status === "Working In Progress").length;
  const closedTickets = tickets.filter((t) => t.status === "Closed").length;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Welcome back, {user.name}!</h2>
          <p className="text-muted mb-0">Here is the status overview of your support requests</p>
        </div>
        <button
          type="button"
          className="btn btn-primary fw-semibold"
          onClick={() => navigate("/raise-ticket")}
        >
          ➕ Raise New Ticket
        </button>
      </div>

      <div className="row g-4 mb-5">
        <DashboardCard title="Total Tickets" value={totalTickets} icon="🎫" variant="indigo" />
        <DashboardCard title="Open Tickets" value={openTickets} icon="🔓" variant="cyan" />
        <DashboardCard title="Working In Progress" value={wipTickets} icon="⚙️" variant="amber" />
        <DashboardCard title="Closed Tickets" value={closedTickets} icon="✅" variant="emerald" />
      </div>

      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Recent Tickets</h4>
          <button
            type="button"
            className="btn btn-sm btn-link fw-semibold text-decoration-none"
            onClick={() => navigate("/my-tickets")}
          >
            View All Tickets →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 mb-0">Loading recent tickets...</p>
          </div>
        ) : (
          <TicketTable tickets={tickets.slice(0, 5)} />
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;