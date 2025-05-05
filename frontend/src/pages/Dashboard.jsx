import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from "@mui/material";

import SaveIcon from '@mui/icons-material/Save';

import api from "../services/api";
import TaskFormModal from "../components/TaskFormModal";
import CompleteTaskModal from "../components/CompleteTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import TaskImportModal from "../components/TaskImportModal";
import UserImportModal from "../components/UserImportModal";
import AreaCreateModal from "../components/AreaCreateModal";
import AppBarSingle from "../components/AppBarSingle";
import BottomNavigationSimple from "../components/BottomNavigationSimple";


export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { user, role } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importUserOpen, setImportUserOpen] = useState(false);
  const [openAreaModal, setOpenAreaModal] = useState(false);

  //Temporal
  const role = "admin";
  const user = "";


  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const completed = tasks.filter(t => t.status === "completed").length;

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

   const fetchAreas = async () => {
    try {
      const response = await api.get("/areas");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };
  useEffect(() => {
    fetchTasks();
    fetchAreas();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
    <AppBarSingle />
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <div>
              <Typography variant="h4" gutterBottom>
                Welcome, {user}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Role: {role}
              </Typography>
            </div>
            {role === "admin" && (
              <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/users")}
                sx={{ ml: 2 }}
              >
                Manage Users
              </Button>
              </>
            )}
            {role === "admin" && (
              <Button onClick={() => navigate("/admin-stats")} sx={{ ml: 2 }}>
                View Stats
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Your Tasks
          </Typography>

          <Box display="flex" gap={4} mt={2}>
            <Typography variant="subtitle1">📋 Total: {total}</Typography>
            <Typography variant="subtitle1" color="error">🔴 Pending: {pending}</Typography>
            <Typography variant="subtitle1" color="success.main">🟢 Completed: {completed}</Typography>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Photo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task.id} onClick={() => setSelectedTaskDetails(task)} style={{ cursor: "pointer" }}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.due_date}</TableCell>
                      <TableCell>
                        {task.status}
                        {role === "employee" && task.status === "pending" && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            Complete
                          </Button>
                        )}
                        {role === "admin" && (
                          <Button size="small" onClick={() => setEditingTask(task)}>
                            Edit
                          </Button>
                        )}
                        {role === "admin" && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => setDeletingTaskId(task.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.image_path ? (
                          <img
                            src={`http://localhost:8000${task.image_path}`}
                            alt="proof"
                            width="80"
                            style={{ borderRadius: "4px" }}
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <CompleteTaskModal
        open={!!selectedTaskId}
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onComplete={() => {
          setSelectedTaskId(null);
          fetchTasks();
        }}
        task
      />

      <TaskFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => {
          setShowModal(false);
          fetchTasks();
        }}
      />

      {editingTask && (
        <EditTaskModal
          open={!!editingTask}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={() => {
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}

      <TaskDetailsModal
        open={!!selectedTaskDetails}
        task={selectedTaskDetails}
        onRefresh={fetchTasks}
        onClose={() => setSelectedTaskDetails(null)}
      />

      <Dialog open={!!deletingTaskId} onClose={() => setDeletingTaskId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this task?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingTaskId(null)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await api.delete(`/tasks/${deletingTaskId}`);
                setDeletingTaskId(null);
              } catch (err) {
                console.error("Failed to delete task", err);
              }
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {role === "admin" && (
        <>
            <AreaCreateModal
              open={openAreaModal}
              onClose={() => setOpenAreaModal(false)}
              onCreated={fetchAreas}
            />
            <TaskImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={fetchTasks} />

            <UserImportModal open={importUserOpen} onClose={() => setImportUserOpen(false)} onImported={fetchTasks} />
            
            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
              >
                <SpeedDialAction
                  key="CreateTask"
                  icon={<SaveIcon />}
                  tooltipTitle="Create Task"
                  onClick={() => setShowModal(true)}
                />

                <SpeedDialAction
                  key="CreateArea"
                  icon={<SaveIcon />}
                  tooltipTitle="Create Area"
                  onClick={() => setOpenAreaModal(true)}
                />

                <SpeedDialAction
                  key="ImportCSV"
                  icon={<SaveIcon />}
                  tooltipTitle="Import CSV"
                  onClick={() => setImportOpen(true)}
                />

                <SpeedDialAction
                  key="ImportUsers"
                  icon={<SaveIcon />}
                  tooltipTitle="Import Users"
                  onClick={() => setImportUserOpen(true)}
                />

                
              </SpeedDial>
            </Box>
          </>

        )}

      <BottomNavigationSimple />
    </Container>
  );
}
