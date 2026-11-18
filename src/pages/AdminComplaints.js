// src/pages/AdminComplaints.js
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api, formatDate } from "../api/api";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () =>
    api.getComplaints()
      .then(setComplaints)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const toggleStatus = async (c) => {
    try {
      await api.setComplaintStatus(c.id, c.status === "Pending" ? "Solved" : "Pending");
      load();
    } catch (e) { setError(e.message); }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? This can't be undone.`)) return;
    try {
      await api.deleteComplaint(c.id);
      load();
    } catch (e) { setError(e.message); }
  };

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return complaints.filter(
      (c) =>
        (filter === "All" || c.status === filter) &&
        [c.title, c.description, c.username, c.full_name].join(" ").toLowerCase().includes(q)
    );
  }, [complaints, search, filter]);

  return (
    <Layout title="All complaints" subtitle="Review, resolve and clean up complaints.">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <div className="toolbar">
          <input className="search" placeholder="Search by title, text or user"
                 value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="tabs">
            {["All", "Pending", "Solved"].map((f) => (
              <button key={f} className={"tab" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="empty">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="empty">No complaints match your search.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Complaint</th><th>Filed by</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="strong">{c.title}</div>
                      <div className="muted clamp">{c.description}</div>
                    </td>
                    <td>{c.full_name || c.username}</td>
                    <td>{formatDate(c.created_at)}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-small btn-outline" onClick={() => toggleStatus(c)}>
                          {c.status === "Pending" ? "Mark solved" : "Reopen"}
                        </button>
                        <button className="btn btn-small btn-danger" onClick={() => remove(c)}>Delete</button>
                      </div>
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