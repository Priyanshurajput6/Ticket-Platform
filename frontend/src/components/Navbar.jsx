import { useNavigate } from "react-router-dom";

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest", role: "" };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 shadow-sm">
      <div className="container-fluid">
        <button
          className="btn btn-outline-light d-md-none me-2"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <span className="navbar-brand fw-bold text-white fs-4">
          🎫 Support Desk
        </span>
        
        <div className="ms-auto d-flex align-items-center gap-3">
          <div className="text-end text-light d-none d-sm-block">
            <div className="fw-semibold">{user.name}</div>
            <small className="text-white-50">{user.role}</small>
          </div>
          
          <div className="vr text-white-50 d-none d-sm-block" style={{ height: "24px" }}></div>
          
          <button 
            type="button" 
            className="btn btn-sm btn-outline-danger fw-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
