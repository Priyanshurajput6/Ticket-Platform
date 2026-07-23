import { useNavigate } from "react-router-dom";

function TicketTable({ tickets, showUser = false, actions }) {
  const navigate = useNavigate();

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

  const formatStatusText = (status) => {
    if (status === "Working In Progress") return "WIP";
    return status;
  };

  return (
    <div className="table-responsive">
      <table className="table align-middle table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: "80px" }}>ID</th>
            <th>Title</th>
            <th>Category</th>
            {showUser && <th>Raised By</th>}
            <th>Priority</th>
            <th>Status</th>
            <th>Raised Date</th>
            <th>Resolved Date</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={showUser ? 9 : 8} className="text-center py-4 text-muted">
                No tickets found.
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="fw-semibold">#{ticket.id}</td>
                <td>
                  <span className="fw-semibold text-slate-800">{ticket.title}</span>
                </td>
                <td>
                  <span className="badge bg-light text-dark border">{ticket.category}</span>
                </td>
                {showUser && (
                  <td>
                    <div className="fw-semibold">{ticket.userName || `User #${ticket.userId}`}</div>
                  </td>
                )}
                <td>
                  <span className={`badge-priority ${getPriorityBadgeClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge-status ${getStatusBadgeClass(ticket.status)}`}>
                    {formatStatusText(ticket.status)}
                  </span>
                </td>
                <td>
                  <small className="text-muted">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </small>
                </td>
                <td>
                  <small className="text-muted">
                    {ticket.resolvedAt 
                      ? new Date(ticket.resolvedAt).toLocaleDateString() 
                      : "-"}
                  </small>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      👁️ Details
                    </button>
                    {actions && actions(ticket)}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;
