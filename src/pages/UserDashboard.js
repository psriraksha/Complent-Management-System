// src/pages/UserDashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api, getUser, formatDate } from "../api/api";

export default function UserDashboard() {
  const user = getUser();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getComplaints(user.id)
      .then(setComplaints)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  const pending = complaints.filter((c) => c.status === "Pending").length;
  const solved = complaints.length - pending;

  return (
    <Layout
      title={`Hello, ${user.full_name || user.username}`}
      subtitle="Here's where your complaints stand."
      action={<Link to="/addComplaint" className="btn btn-primary">New complaint</Link>}
    >
      <div className="stats">
        <div className="stat"><span className="stat-num">{complaints.length}</span><span>Total filed</span></div>
        <div className="stat stat-pending"><span className="stat-num">{pending}</span><span>Waiting for a fix</span></div>
        <div className="stat stat-solved"><span className="stat-num">{solved}</span><span>Solved</span></div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <div className="panel-head"><h2>Your complaints</h2></div>

        {loading ? (
          <p className="empty">Loading…</p>
        ) : complaints.length === 0 ? (
          <div className="empty">
            <p>You haven't filed any complaints yet.</p>
            <Link to="/addComplaint" className="btn btn-primary">File your first complaint</Link>
          </div>
        ) : (
          <ul className="complaint-list">
            {complaints.map((c) => (
              <li key={c.id} className={`complaint complaint-${c.status.toLowerCase()}`}>
                <div className="complaint-top">
                  <h3>{c.title}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <p>{c.description}</p>
                <small className="muted">Filed on {formatDate(c.created_at)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}