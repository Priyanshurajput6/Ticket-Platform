import { NavLink } from "react-router-dom";

function Sidebar({ active, onClose }) {
  const user = JSON.parse(localStorage.getItem("user")) || { role: "" };

  const getLinks = () => {
    switch (user.role) {
      case "User":
        return [
          { path: "/dashboard", label: "📊 Dashboard" },
          { path: "/my-tickets", label: "📋 My Tickets" },
          { path: "/raise-ticket", label: "➕ Raise Ticket" },
        ];
      case "Support":
        return [
          { path: "/support", label: "🛠️ Support Dashboard" },
        ];
      case "Admin":
        return [
          { path: "/admin", label: "👑 Admin Overview" },
          { path: "/admin/users", label: "👥 User Management" },
          { path: "/admin/support", label: "👷 Support Management" },
          { path: "/admin/tickets", label: "🎟️ Ticket Assignments" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className={`sidebar-container ${active ? "active" : ""}`}>
      <div className="d-flex justify-content-between align-items-center px-4 py-4 border-bottom border-secondary">
        <h5 className="mb-0 fw-bold text-white">🎛️ NAVIGATION</h5>
        <button
          className="btn-close btn-close-white d-md-none"
          onClick={onClose}
          aria-label="Close Sidebar"
        ></button>
      </div>
      
      <div className="flex-grow-1 px-3 py-4">
        <ul className="nav flex-column gap-2">
          {links.map((link) => (
            <li className="nav-item" key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => 
                  `nav-link text-white py-3 px-3 rounded transition-all d-block ${
                    isActive ? "active-nav-item bg-primary fw-semibold" : "opacity-75"
                  }`
                }
                onClick={onClose}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-3 border-top border-secondary text-center">
        <small className="text-white-50"></small>
      </div>
    </div>
  );
}

export default Sidebar;
