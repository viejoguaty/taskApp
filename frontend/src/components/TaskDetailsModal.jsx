import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Box,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function TaskDetailsModal({ open, onClose, task, onRefresh = () => {}  }) {
  const { role } = useSelector((state) => state.auth);

  const [newStatus, setNewStatus] = useState("");
  useEffect(() => {
    if (task) setNewStatus(task.status);
  }, [task]);

  if (!task) return null;


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {task.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Assigned to: {task.assigned_to}</Typography>
          <Typography variant="body2">Area: {task.area_id}</Typography>
          <Typography variant="body2">Due date: {task.due_date}</Typography>
          <Typography variant="body2">Created at: {task.created_at}</Typography>
          {task.completed_at && (
            <Typography variant="body2">Completed at: {task.completed_at}</Typography>
          )}
        </Box>

        {task.image_path && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Evidence:</Typography>
            <img
              src={`http://localhost:8000${task.image_path}`}
              alt="task proof"
              style={{ width: "100%", borderRadius: "4px" }}
            />
          </Box>
        )}

      {task.comment && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Employee Comment:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {task.comment}
          </Typography>
        </Box>
      )}

      {role === "admin" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Update Status:</Typography>
          <TextField
            select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Box>
      )}

      </DialogContent>
      <DialogActions>
        {role === "admin" && (
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={task.allow_comments}
                  onChange={async (e) => {
                    try {
                      await api.patch(`/tasks/${task.id}`, {
                        allow_comments: e.target.checked,
                      });
                      onRefresh();
                    } catch (err) {
                      console.error("Failed to toggle comments", err);
                    }
                  }}
                />
              }
              label="Allow comments from employee"
            />
          </Box>
        )}

      {role === "admin" && (
        <Button
          onClick={async () => {
            try {
              await api.patch(`/tasks/${task.id}`, { status: newStatus });
              onClose();
              onRefresh?.(); // optional callback from Dashboard
            } catch (err) {
              console.error("Failed to update status", err);
            }
          }}
          variant="contained"
        >
          Save
        </Button>
      )}

        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>

  );
}
