// src/pages/AddComplaint.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api, getUser } from "../api/api";

export default function AddComplaint() {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.addComplaint({ ...form, user_id: user.id });
      navigate("/user");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Layout title="New complaint" subtitle="Describe the problem so it can be fixed quickly.">
      <div className="panel form-panel">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Title</span>
            <input name="title" value={form.title} onChange={handleChange}
                   placeholder="Short summary, e.g. Printer on floor 2 is not working"
                   maxLength={255} required autoFocus />
          </label>
          <label className="field">
            <span>What happened?</span>
            <textarea name="description" rows={7} value={form.description} onChange={handleChange}
                      placeholder="Include where, when, and anything you already tried." required />
          </label>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/user")}>Cancel</button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting…" : "Submit complaint"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}