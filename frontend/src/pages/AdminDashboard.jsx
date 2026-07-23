import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import TicketTable from "../components/TicketTable";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [supportPersons, setSupportPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const config = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchAdminData = async () => {
    try {
      const [usersRes, ticketsRes, supportRes] = await Promise.all([
        axios.get("http://localhost:5243/api/Admin/users", config()),
        axios.get("http://localhost:5243/api/Admin/tickets", config()),
        axios.get("http://localhost:5243/api/Admin/support-persons", config()),
      ]);

      setUsers(usersRes.data);
      setTickets(ticketsRes.data);
      setSupportPersons(supportRes.data);
    } catch (error) {
      console.error("Admin data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openTickets = tickets.filter((ticket) => ticket.status === "Open").length;
  const wipTickets = tickets.filter((ticket) => ticket.status === "Working In Progress").length;
  const closedTickets = tickets.filter((ticket) => ticket.status === "Closed").length;

  return (
    <Layout>
      <div className="mb-4">
        <h2 className="fw-bold">Admin Dashboard Overview</h2>
        <p className="text-muted mb-0">System performance, tickets queue, and user metrics</p>
      </div>

      <div className="row g-4 mb-5">
        <DashboardCard title="Total Users" value={users.length} icon="👥" variant="indigo" />
        <DashboardCard title="Support Agents" value={supportPersons.length} icon="👷" variant="indigo" />
        <DashboardCard title="Total Tickets" value={tickets.length} icon="🎫" variant="indigo" />
        <DashboardCard title="Open Tickets" value={openTickets} icon="🔓" variant="cyan" />
        <DashboardCard title="Working In Progress" value={wipTickets} icon="⚙️" variant="amber" />
        <DashboardCard title="Closed Tickets" value={closedTickets} icon="✅" variant="emerald" />
      </div>

      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">System Tickets Queue</h4>
          <button
            type="button"
            className="btn btn-sm btn-link fw-semibold text-decoration-none"
            onClick={() => navigate("/admin/tickets")}
          >
            Assign & Manage Tickets →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 mb-0">Loading recent tickets...</p>
          </div>
        ) : (
          <TicketTable tickets={tickets.slice(0, 5)} showUser={true} />
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;