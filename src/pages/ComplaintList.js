import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import { Container, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    const res = await API.get("/complaints");
    setComplaints(res.data);
  };

  const deleteComplaint = async (id) => {
    await API.delete(`/complaints/${id}`);
    fetchComplaints();
  };

  useEffect(() => { fetchComplaints(); }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Button variant="contained" onClick={() => navigate("/add")}>Add Complaint</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.title}</TableCell>
              <TableCell>{c.description}</TableCell>
              <TableCell>{c.status}</TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/edit/${c.id}`)}>Edit</Button>
                <Button color="error" onClick={() => deleteComplaint(c.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
