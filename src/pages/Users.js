// src/pages/Users.js
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api, formatDate } from "../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () =>
    api.getUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const toggle = async (u) => {
    try {
      await api.setUserStatus(u.id, u.status === "active" ? "inactive" : "active");
      load();
    } catch (e) { setError(e.message); }
  };

  return (
    <Layout title="Users" subtitle="Deactivate an account to block its login.">
      {error && <div className="alert alert-error">{error}</div>}
      <div className="panel">
        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>User</th><th>Contact</th><th>Department</th><th>Joined</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="person">
                        <span className="avatar">{(u.full_name || u.username).trim().charAt(0).toUpperCase()}</span>
                        <div>
                          <div className="strong">{u.full_name || u.username}</div>
                          <div className="muted">@{u.username} · {u.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{u.email || "—"}</div>
                      <div className="muted">{u.phone || ""}</div>
                    </td>
                    <td>{u.department || "—"}</td>
                    <td>{formatDate(u.created_at)}</td>
                    <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                    <td>
                      {u.role !== "admin" && (
                        <button className="btn btn-small btn-outline" onClick={() => toggle(u)}>
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}