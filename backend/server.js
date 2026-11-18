// backend/server.js
// Install once:  npm install express cors mysql2
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

// 127.0.0.1 avoids the IPv6 (::1) connection problem you saw earlier
const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "complaint_system",
  waitForConnections: true,
  connectionLimit: 10,
});

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  });

/* ---------- Auth ---------- */
app.post("/api/login", wrap(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Enter your username and password." });

  const [rows] = await pool.query(
    "SELECT id, username, role, full_name, email, status FROM users WHERE username = ? AND password = ?",
    [username.trim(), password]
  );
  if (rows.length === 0)
    return res.status(401).json({ message: "Wrong username or password." });
  if (rows[0].status === "inactive")
    return res.status(403).json({ message: "This account is inactive. Contact an admin." });

  res.json(rows[0]);
}));

app.post("/api/register", wrap(async (req, res) => {
  const { username, password, full_name, email, phone, department } = req.body;
  if (!username || !password || !full_name)
    return res.status(400).json({ message: "Name, username and password are required." });

  const [exists] = await pool.query("SELECT id FROM users WHERE username = ?", [username.trim()]);
  if (exists.length > 0)
    return res.status(409).json({ message: "That username is already taken." });

  await pool.query(
    "INSERT INTO users (username, password, role, full_name, email, phone, department) VALUES (?, ?, 'user', ?, ?, ?, ?)",
    [username.trim(), password, full_name, email || null, phone || null, department || null]
  );
  res.status(201).json({ message: "Account created." });
}));

/* ---------- Complaints ---------- */
app.get("/api/complaints", wrap(async (req, res) => {
  const { user_id } = req.query;
  let sql = `SELECT c.id, c.user_id, c.title, c.description, c.status, c.created_at,
                    u.username, u.full_name, u.department
             FROM complaints c LEFT JOIN users u ON u.id = c.user_id`;
  const params = [];
  if (user_id) { sql += " WHERE c.user_id = ?"; params.push(user_id); }
  sql += " ORDER BY c.created_at DESC";
  const [rows] = await pool.query(sql, params);
  res.json(rows);
}));

app.post("/api/complaints", wrap(async (req, res) => {
  const { user_id, title, description } = req.body;
  if (!user_id || !title || !description)
    return res.status(400).json({ message: "Title and description are required." });
  await pool.query(
    "INSERT INTO complaints (user_id, title, description) VALUES (?, ?, ?)",
    [user_id, title.trim(), description.trim()]
  );
  res.status(201).json({ message: "Complaint submitted." });
}));

app.put("/api/complaints/:id/status", wrap(async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "Solved"].includes(status))
    return res.status(400).json({ message: "Invalid status." });
  await pool.query("UPDATE complaints SET status = ? WHERE id = ?", [status, req.params.id]);
  res.json({ message: "Status updated." });
}));

app.delete("/api/complaints/:id", wrap(async (req, res) => {
  await pool.query("DELETE FROM complaints WHERE id = ?", [req.params.id]);
  res.json({ message: "Complaint deleted." });
}));

/* ---------- Users (admin) ---------- */
app.get("/api/users", wrap(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, username, role, full_name, email, phone, department, created_at, status FROM users ORDER BY id"
  );
  res.json(rows);
}));

app.put("/api/users/:id/status", wrap(async (req, res) => {
  const { status } = req.body;
  if (!["active", "inactive"].includes(status))
    return res.status(400).json({ message: "Invalid status." });
  await pool.query("UPDATE users SET status = ? WHERE id = ? AND role <> 'admin'", [status, req.params.id]);
  res.json({ message: "User updated." });
}));

/* ---------- Start only after the database is reachable ---------- */
const PORT = 5000;
pool.getConnection()
  .then((conn) => {
    conn.release();
    console.log("✅ Database connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.code || err.message);
    process.exit(1);
  });