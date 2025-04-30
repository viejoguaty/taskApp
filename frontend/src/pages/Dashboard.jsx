import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
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
  Box 
} from "@mui/material";
import api from "../services/api";
import TaskFormModal from "../components/TaskFormModal";
import CompleteTaskModal from "../components/CompleteTaskModal";


export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const completed = tasks.filter(t => t.status === "completed").length;


  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Card sx={{ mb: 4 }}>
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
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: 2 }}
                  onClick={() => setShowModal(true)}
                >
                  Create Task
                </Button>
              </>

            )}

            <Button onClick={handleLogout} variant="contained" color="error">
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Your Tasks
          </Typography>

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
                    <TableRow key={task.id}>
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
        }}
      />
      <TaskFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => {
          setShowModal(false);
        }}
      />
    </Container>
  );
}
