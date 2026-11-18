// src/components/StatusBadge.js
import React from "react";

export default function StatusBadge({ status }) {
  const key = String(status).toLowerCase();
  return <span className={`badge badge-${key}`}>{status}</span>;
}