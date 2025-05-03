import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Button, IconButton, Dialog, DialogActions,
  DialogTitle
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import AreaCreateModal from "../components/AreaCreateModal";

export default function AreaManagement() {
  const [areas, setAreas] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAreas = async () => {
    const res = await api.get("/areas");
    setAreas(res.data);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleDelete = async () => {
    await api.delete(`/areas/${deleteId}`);
    setDeleteId(null);
    fetchAreas();
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Manage Areas
      </Typography>

      <Button onClick={() => setOpenCreate(true)} variant="contained" sx={{ mb: 2 }}>
        Create Area
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {areas.map((area) => (
            <TableRow key={area.id}>
              <TableCell>{area.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => setDeleteId(area.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AreaCreateModal open={openCreate} onClose={() => setOpenCreate(false)} onCreated={fetchAreas} />

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete this area?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
