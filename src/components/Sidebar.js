// src/components/Sidebar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/api";

const userLinks = [
  { text: "My complaints", path: "/user", icon: "📋", end: true },
  { text: "New complaint", path: "/addComplaint", icon: "✏️" },
];

const adminLinks = [
  { text: "Overview", path: "/admin", icon: "📊", end: true },
  { text: "All complaints", path: "/admin/complaints", icon: "📋" },
  { text: "Users", path: "/admin/users", icon: "👥" },
];

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const links = role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">C</span>
        <div>
          <strong>Complaint Desk</strong>
          <small>{role === "admin" ? "Admin panel" : "Your workspace"}</small>
        </div>
      </div>

      <nav className="nav">
        {links.map((l) => (
          <NavLink
            key={l.path}
            to={l.path}
            end={l.end}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <span className="nav-icon">{l.icon}</span>
            {l.text}
          </NavLink>
        ))}
      </nav>

      <button className="nav-link logout" onClick={handleLogout}>
        <span className="nav-icon">🚪</span>
        Log out
      </button>
    </aside>
  );
}