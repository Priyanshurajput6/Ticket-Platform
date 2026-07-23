import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5243/api/Tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTicket(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "high";
      case "medium": return "medium";
      case "low":
      default: return "low";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "closed": return "closed";
      case "working in progress":
      case "wip":
        return "wip";
      case "open":
      default: return "open";
    }
  };

  const handleBack = () => {
    if (user.role === "Admin") {
      navigate("/admin");
    } else if (user.role === "Support") {
      navigate("/support");
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading ticket details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !ticket) {
    return (
      <Layout>
        <div className="alert alert-danger mx-auto mt-4" style={{ maxWidth: "600px" }}>
          <h4 className="alert-heading">Error</h4>
          <p>{error || "Ticket not found"}</p>
          <hr />
          <button className="btn btn-outline-danger btn-sm" onClick={handleBack}>
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4">
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={handleBack}>
          ← Back
        </button>
        <div className="d-flex align-items-center gap-3">
          <h2 className="fw-bold mb-0">Ticket Details</h2>
          <span className="text-muted fs-4 fw-semibold">#{ticket.id}</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h4 className="fw-bold mb-3">{ticket.title}</h4>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge bg-light text-dark border align-self-center py-2 px-3">{ticket.category}</span>
              <span className={`badge-priority ${getPriorityBadgeClass(ticket.priority)}`}>{ticket.priority} Priority</span>
              <span className={`badge-status ${getStatusBadgeClass(ticket.status)}`}>{ticket.status}</span>
            </div>

            <h6 className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: "0.75rem" }}>Description</h6>
            <div className="bg-light p-3 rounded mb-4" style={{ whiteSpace: "pre-wrap" }}>
              {ticket.description}
            </div>

            {ticket.resolutionMessage && (
              <div className="card border-success p-3 mt-4" style={{ backgroundColor: "#f0fdf4" }}>
                <h6 className="fw-bold text-success text-uppercase mb-2" style={{ fontSize: "0.75rem" }}>Resolution Message</h6>
                <p className="mb-0 text-success" style={{ whiteSpace: "pre-wrap" }}>{ticket.resolutionMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-4">Meta Information</h5>
            
            <div className="mb-3">
              <label className="text-muted text-uppercase fw-semibold d-block mb-1" style={{ fontSize: "0.7rem" }}>Raised By</label>
              <span className="fw-semibold">{ticket.userName || "Unknown"}</span>
            </div>

            <div className="mb-3">
              <label className="text-muted text-uppercase fw-semibold d-block mb-1" style={{ fontSize: "0.7rem" }}>Assigned Support</label>
              <span className="fw-semibold">
                {ticket.assignedSupportPersonName ? `👷 ${ticket.assignedSupportPersonName}` : "Not Assigned"}
              </span>
            </div>

            <div className="mb-3">
              <label className="text-muted text-uppercase fw-semibold d-block mb-1" style={{ fontSize: "0.7rem" }}>Date Raised</label>
              <span className="fw-semibold">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>

            {ticket.resolvedAt && (
              <div className="mb-3">
                <label className="text-muted text-uppercase fw-semibold d-block mb-1" style={{ fontSize: "0.7rem" }}>Date Resolved</label>
                <span className="fw-semibold">{new Date(ticket.resolvedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TicketDetails;
