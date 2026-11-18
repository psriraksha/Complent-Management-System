// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api, formatDate } from "../api/api";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getComplaints(), api.getUsers()])
      .then(([c, u]) => { setComplaints(c); setUsers(u); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const pending = complaints.filter((c) => c.status === "Pending").length;
  const solved = complaints.length - pending;
  const rate = complaints.length ? Math.round((solved / complaints.length) * 100) : 0;

  return (
    <Layout title="Overview" subtitle="What needs attention right now.">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats stats-4">
        <div className="stat"><span className="stat-num">{complaints.length}</span><span>Complaints</span></div>
        <div className="stat stat-pending"><span className="stat-num">{pending}</span><span>Pending</span></div>
        <div className="stat stat-solved"><span className="stat-num">{solved}</span><span>Solved</span></div>
        <div className="stat"><span className="stat-num">{users.filter((u) => u.role === "user").length}</span><span>Registered users</span></div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Resolution rate</h2>
          <span className="muted">{rate}% solved</span>
        </div>
        <div className="progress"><div className="progress-bar" style={{ width: `${rate}%` }} /></div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Latest complaints</h2>
          <Link to="/admin/complaints" className="link">See all</Link>
        </div>
        {loading ? (
          <p className="empty">Loading…</p>
        ) : complaints.length === 0 ? (
          <p className="empty">No complaints yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Filed by</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td className="strong">{c.title}</td>
                    <td>{c.full_name || c.username}</td>
                    <td>{formatDate(c.created_at)}</td>
                    <td><StatusBadge status={c.status} /></td>
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