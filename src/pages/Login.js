// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, saveUser } from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await api.login(form);
      saveUser(user);
      navigate(user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-intro">
        <span className="brand-mark large">C</span>
        <h1>Say what's wrong. We'll track it until it's fixed.</h1>
        <p>
          File a complaint in under a minute, watch its status change from
          Pending to Solved, and never wonder who is handling it.
        </p>
      </section>

      <section className="auth-card">
        <h2>Welcome back</h2>
        <p className="muted">Log in to see your complaints.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input name="username" value={form.username} onChange={handleChange}
                   placeholder="e.g. user1" autoComplete="username" required autoFocus />
          </label>
          <label className="field">
            <span>Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange}
                   placeholder="Your password" autoComplete="current-password" required />
          </label>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
}