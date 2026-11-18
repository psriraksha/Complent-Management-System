// src/components/Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import { getUser } from "../api/api";

export default function Layout({ title, subtitle, action, children }) {
  const user = getUser();
  const name = user?.full_name || user?.username || "User";

  return (
    <div className="shell">
      <Sidebar role={user?.role} />
      <main className="main">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="topbar-right">
            {action}
            <div className="user-chip">
              <span className="avatar">{name.trim().charAt(0).toUpperCase()}</span>
              <span>{name}</span>
            </div>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}