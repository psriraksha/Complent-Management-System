// src/pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";

const departments = ["Sales", "Marketing", "HR", "Finance", "IT", "Operations", "Other"];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", username: "", password: "", email: "", phone: "", department: "Sales",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(form);
      navigate("/login");
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
        <h1>Create your account</h1>
        <p>One account lets you file complaints and follow each one to resolution.</p>
      </section>

      <section className="auth-card">
        <h2>Sign up</h2>
        <p className="muted">It takes about a minute.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Full name</span>
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Username</span>
              <input name="username" value={form.username} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Password</span>
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </label>
          </div>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label className="field">
              <span>Department</span>
              <select name="department" value={form.department} onChange={handleChange}>
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
}