// src/api/api.js
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Can't reach the server. Check that the backend is running.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

export const api = {
  login: (body) => request("/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/register", { method: "POST", body: JSON.stringify(body) }),
  getComplaints: (userId) => request(userId ? `/complaints?user_id=${userId}` : "/complaints"),
  addComplaint: (body) => request("/complaints", { method: "POST", body: JSON.stringify(body) }),
  setComplaintStatus: (id, status) =>
    request(`/complaints/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteComplaint: (id) => request(`/complaints/${id}`, { method: "DELETE" }),
  getUsers: () => request("/users"),
  setUserStatus: (id, status) =>
    request(`/users/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};

/* ---------- Session helpers ---------- */
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
};
export const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));
export const logout = () => localStorage.removeItem("user");

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });