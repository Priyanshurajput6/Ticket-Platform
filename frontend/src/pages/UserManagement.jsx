import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5243/api/Admin/users", config);
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This will delete all of their raised tickets.`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5243/api/Admin/delete-user/${id}`, config);
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to delete user");
    }
  };

  return (
    <Layout>
      <div className="mb-4">
        <h2 className="fw-bold">User Management</h2>
        <p className="text-muted mb-0">View registered users and manage their accounts</p>
      </div>

      <div className="card shadow-sm border-0 p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 mb-0">Loading users...</p>
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No registered users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-semibold">#{u.id}</td>
                      <td>
                        <span className="fw-semibold text-slate-800">{u.name}</span>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.mobileNumber || "-"}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                        >
                          🗑️ Delete User
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

export default UserManagement;
