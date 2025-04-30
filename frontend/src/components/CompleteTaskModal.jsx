import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Input,
} from "@mui/material";
import { useState } from "react";
import api from "../services/api";

export default function CompleteTaskModal({ open, onClose, taskId, onCompleted }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!file) return setError("Please attach an image");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.patch(`/tasks/${taskId}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onCompleted();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Complete Task</DialogTitle>
      <DialogContent>
        <Typography>Select an image as evidence:</Typography>
        <Input
          type="file"
          fullWidth
          onChange={(e) => setFile(e.target.files[0])}
          sx={{ mt: 2 }}
        />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
