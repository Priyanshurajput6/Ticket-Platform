import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import TicketTable from "../components/TicketTable";

function TicketAssignment() {
  const [tickets, setTickets] = useState([]);
  const [supportPersons, setSupportPersons] = useState([]);
  const [selectedSupport, setSelectedSupport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAssignmentData = async () => {
    try {
      const [ticketsRes, supportRes] = await Promise.all([
        axios.get("http://localhost:5243/api/Admin/tickets", config),
        axios.get("http://localhost:5243/api/Admin/support-persons", config),
      ]);
      setTickets(ticketsRes.data);
      setSupportPersons(supportRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentData();
  }, []);

  const assignTicket = async (ticketId) => {
    const supportId = selectedSupport[ticketId];
    if (!supportId) {
      alert("Please select a support person");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5243/api/Admin/assign-ticket/${ticketId}/${supportId}`,
        {},
        config
      );
      alert("Ticket assigned successfully");
      fetchAssignmentData();
    } catch (err) {
      console.error(err);
      alert("Failed to assign ticket");
    }
  };

  const renderAssignmentActions = (ticket) => {
    return (
      <div className="d-flex align-items-center gap-2">
        <select
          className="form-select form-select-sm"
          style={{ width: "180px" }}
          value={selectedSupport[ticket.id] || ticket.assignedSupportPersonId || ""}
          onChange={(e) =>
            setSelectedSupport({
              ...selectedSupport,
              [ticket.id]: e.target.value,
            })
          }
        >
          <option value="">Select Support Person</option>
          {supportPersons.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => assignTicket(ticket.id)}
        >
          Assign
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="mb-4">
        <h2 className="fw-bold">Ticket Assignment</h2>
        <p className="text-muted mb-0">Monitor all support tickets and delegate them to support agents</p>
      </div>

      <div className="card shadow-sm border-0 p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 mb-0">Loading tickets and staff...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : (
          <TicketTable 
            tickets={tickets} 
            showUser={true} 
            actions={renderAssignmentActions} 
          />
        )}
      </div>
    </Layout>
  );
}

export default TicketAssignment;
