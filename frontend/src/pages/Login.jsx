import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5243/api/Auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "Admin") {
        navigate("/admin");
      } else if (response.data.user.role === "Support") {
        navigate("/support");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(
        error.response?.data || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-container">
        <div className="text-center mb-4">
          <div className="logo-badge">🎫</div>
          <h3 className="fw-bold text-slate-900 mb-1">Sign In</h3>
          <p className="text-muted fw-bold" style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}>SUPPORT TICKET SYSTEM</p>
        </div>

        {message && (
          <div className="alert alert-danger text-center py-2 px-3 mb-4 rounded-3 border-0" style={{ fontSize: "0.85rem" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: "0.8rem" }}>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control auth-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: "0.8rem" }}>Password</label>
            <input
              type="password"
              name="password"
              className="form-control auth-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-submit w-100 fw-semibold" disabled={loading}>
            {loading && (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            )}
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link fw-semibold">Register here</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f1f5f9;
          padding: 20px;
        }

        .auth-card-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          animation: fadeIn 0.3s ease-out;
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          background-color: #e0e7ff;
          color: #4f46e5;
          border-radius: 10px;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .auth-input {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .auth-input:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
        }

        .btn-submit {
          background: #4f46e5 !important;
          border: none !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 12px !important;
          font-weight: 600;
          transition: background-color 0.2s ease !important;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #4338ca !important;
        }

        .auth-link {
          color: #4f46e5;
          text-decoration: none;
        }

        .auth-link:hover {
          color: #4338ca;
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;