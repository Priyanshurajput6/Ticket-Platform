import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function SupportManagement() {
  const [supportPersons, setSupportPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    passwordHash: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchSupportPersons = async () => {
    try {
      const response = await axios.get("http://localhost:5243/api/Admin/support-persons", config);
      setSupportPersons(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load support persons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportPersons();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");

    try {
      await axios.post("http://localhost:5243/api/Admin/create-support", formData, config);
      setFormMessage("Support person created successfully!");
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        passwordHash: "",
      });
      setShowAddForm(false);
      fetchSupportPersons();
    } catch (err) {
      console.error(err);
      setFormMessage(err.response?.data || "Failed to create support person");
    }
  };

  const handleDeleteSupport = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete support person "${name}"? Their assigned tickets will be set back to unassigned.`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5243/api/Admin/delete-user/${id}`, config);
      alert("Support person deleted successfully");
      fetchSupportPersons();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to delete support person");
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Support Person Management</h2>
          <p className="text-muted mb-0">Manage support staff and create new support credentials</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFormMessage("");
          }}
        >
          {showAddForm ? "Cancel" : "➕ Add Support Person"}
        </button>
      </div>

      {showAddForm && (
        <div className="card shadow-sm border-0 p-4 mb-4" style={{ maxWidth: "600px" }}>
          <h4 className="fw-bold mb-3">New Support Person</h4>
          {formMessage && (
            <div className={`alert ${formMessage.includes("successfully") ? "alert-success" : "alert-danger"}`}>
              {formMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                className="form-control"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="passwordHash"
                className="form-control"
                value={formData.passwordHash}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Create Support Account
            </button>
          </form>
        </div>
      )}

      <div className="card shadow-sm border-0 p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 mb-0">Loading support staff...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supportPersons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No support persons registered.
                    </td>
                  </tr>
                ) : (
                  supportPersons.map((sp) => (
                    <tr key={sp.id}>
                      <td className="fw-semibold">#{sp.id}</td>
                      <td>
                        <span className="fw-semibold text-slate-800">{sp.name}</span>
                      </td>
                      <td>{sp.email}</td>
                      <td>{sp.mobileNumber || "-"}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteSupport(sp.id, sp.name)}
                        >
                          🗑️ Remove Staff
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SupportManagement;
