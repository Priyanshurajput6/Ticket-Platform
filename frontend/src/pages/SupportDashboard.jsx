import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import TicketTable from "../components/TicketTable";

function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [resolution, setResolution] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5243/api/Support/assigned-tickets",
        config
      );
      setTickets(response.data);
    } catch (err) {
      console.error("Failed to load tickets", err);
      setError("Failed to load assigned tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const startTicket = async (ticketId) => {
    try {
      await axios.put(
        `http://localhost:5243/api/Support/start/${ticketId}`,
        {},
        config
      );
      fetchTickets();
    } catch (err) {
      console.error("Failed to start ticket", err);
      alert("Failed to start ticket");
    }
  };

  const closeTicket = async (ticketId) => {
    const message = resolution[ticketId] || "";
    if (!message.trim()) {
      alert("Please enter a resolution message before closing the ticket.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5243/api/Support/close/${ticketId}`,
        JSON.stringify(message),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchTickets();
    } catch (err) {
      console.error("Failed to close ticket", err);
      alert("Failed to close ticket");
    }
  };

  const renderSupportActions = (ticket) => {
    return (
      <div className="d-flex align-items-center gap-2">
        {ticket.status === "Open" && (
          <button
            type="button"
            className="btn btn-sm btn-warning fw-semibold"
            onClick={() => startTicket(ticket.id)}
          >
            ⚙️ Start Work
          </button>
        )}

        {ticket.status === "Working In Progress" && (
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Enter resolution message..."
              style={{ width: "220px" }}
              value={resolution[ticket.id] || ""}
              onChange={(e) =>
                setResolution({
                  ...resolution,
                  [ticket.id]: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="btn btn-sm btn-success fw-semibold"
              onClick={() => closeTicket(ticket.id)}
            >
              ✅ Close Ticket
            </button>
          </div>
        )}
      </div>
    );
  };

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const wipCount = tickets.filter((t) => t.status === "Working In Progress").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;

  return (
    <Layout>
      <div className="mb-4">
        <h2 className="fw-bold">Support Agent Dashboard</h2>
        <p className="text-muted mb-0">Manage and resolve tickets assigned to you</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card stat-card p-4 border-0 shadow-sm text-center">
            <h5 className="text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: "0.75rem" }}>Open (Assigned)</h5>
            <h2 className="fw-bold mb-0 text-cyan">{openCount}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card p-4 border-0 shadow-sm text-center">
            <h5 className="text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: "0.75rem" }}>In Progress</h5>
            <h2 className="fw-bold mb-0 text-warning">{wipCount}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card p-4 border-0 shadow-sm text-center">
            <h5 className="text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: "0.75rem" }}>Closed By You</h5>
            <h2 className="fw-bold mb-0 text-success">{closedCount}</h2>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold mb-4">Assigned Tickets</h4>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading assigned tickets...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : (
          <TicketTable tickets={tickets} actions={renderSupportActions} />
        )}
      </div>
    </Layout>
  );
}

export default SupportDashboard;