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

export default function EditTaskModal({ open, onClose, task, onUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [areaId, setAreaId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [areas, setAreas] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.due_date);
      setAreaId(task.area_id);
      setAssignedTo(task.assigned_to);

      api.get("/areas").then((res) => setAreas(res.data));
      api.get("/users").then((res) => setUsers(res.data));
    }
  }, [open, task]);

  const handleSubmit = async () => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title,
        description,
        due_date: dueDate,
        area_id: areaId,
        assigned_to: assignedTo,
      });
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField label="Title" fullWidth margin="dense" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Description" fullWidth margin="dense" value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField label="Due Date" type="date" fullWidth margin="dense" value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Area" select fullWidth margin="dense" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
          {areas.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
        </TextField>
        <TextField label="Assign To" select fullWidth margin="dense" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          {users.map((u) => <MenuItem key={u.id} value={u.id}>{u.email}</MenuItem>)}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
