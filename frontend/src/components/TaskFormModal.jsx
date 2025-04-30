import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function TaskFormModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [areaId, setAreaId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [areas, setAreas] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      api.get("/areas").then(res => setAreas(res.data));
      api.get("/users").then(res => setUsers(res.data));
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      await api.post("/tasks", {
        title,
        description,
        due_date: dueDate,
        area_id: areaId,
        assigned_to: assignedTo,
      });
      onCreated(); // reload tasks
      onClose();   // close modal
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="dense"
        />
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
        />
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Area"
          select
          fullWidth
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
          margin="dense"
        >
          {areas.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Assign To (User)"
          select
          fullWidth
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          margin="dense"
        >
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.email}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
