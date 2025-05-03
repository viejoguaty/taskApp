import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Input, Typography
} from "@mui/material";
import { useState } from "react";
import api from "../services/api";

export default function UserImportModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null);

  const handleImport = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/users/import-csv", formData);
      onImported();
      onClose();
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Import Users from CSV</DialogTitle>
      <DialogContent>
        <Typography>Upload a .csv file with email, password, role</Typography>
        <Input type="file" fullWidth onChange={(e) => setFile(e.target.files[0])} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleImport} variant="contained" disabled={!file}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
