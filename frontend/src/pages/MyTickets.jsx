import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import TicketTable from "../components/TicketTable";

function MyTickets() {
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

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">My Tickets</h2>
          <p className="text-muted mb-0">Manage and track your raised support tickets</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 mb-0">Loading your tickets...</p>
          </div>
        ) : (
          <TicketTable tickets={tickets} />
        )}
      </div>
    </Layout>
  );
}

export default MyTickets;
