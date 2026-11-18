import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Card, CardContent, Button, List, ListItem } from "@mui/material";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user"));

  // Fetch all complaints
  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/${id}`, { status });
      fetchComplaints(); // Refresh list
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Box>
      {/* Navbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6">Admin Dashboard</Typography>
        <Button variant="outlined" color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Box sx={{ width: 200, bgcolor: "#f5f5f5", p: 2, minHeight: "80vh" }}>
          <List>
            <ListItem button onClick={() => navigate("/admin")}>Dashboard</ListItem>
            <ListItem button onClick={() => navigate("/admin/users")}>Users</ListItem>
            <ListItem button onClick={() => navigate("/admin/reports")}>Reports</ListItem>
          </List>
        </Box>

        {/* Main Content */}
        <Container sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>All Complaints</Typography>
          {complaints.length === 0 ? (
            <Typography>No complaints found.</Typography>
          ) : (
            complaints.map((c) => (
              <Card key={c.id} sx={{ mb: 2, p: 1 }}>
                <CardContent>
                  <Typography variant="h6">{c.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{c.description}</Typography>
                  <Typography variant="body2" color={c.status === "Solved" ? "green" : "orange"}>
                    Status: {c.status}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {c.status !== "Solved" && (
                      <Button variant="contained" size="small" onClick={() => updateStatus(c.id, "Solved")}>
                        Mark Solved
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Container>
      </Box>
    </Box>
  );
}
