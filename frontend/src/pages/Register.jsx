import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import api from "../services/api";

export default function Register({ setOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [company_id, setCompanyId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/users/register", {
        email,
        password,
        role: "employee",
        first_name,
        last_name,
        company_id,
      });
      navigate("/");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minWidth: 320, height: '100vh' }} className="center-box">
      {setOpen && 
        <Button onClick={() => setOpen(false)}>
          <ArrowBackIosIcon  fontSize="small" /> Go back
        </Button>
      }
      <div>
        <Typography variant="h5" textAlign="center">
          Create an Account
        </Typography>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <TextField label="First Name" type="text" fullWidth margin="normal" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
        <TextField label="Last Lame" type="text" fullWidth margin="normal" value={last_name} onChange={(e) => setLastName(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
          Register
        </Button>
      </div>
    </Container>
  );
}
