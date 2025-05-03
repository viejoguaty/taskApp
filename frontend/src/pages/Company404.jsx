import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Company404() {
  const navigate = useNavigate();
  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" color="error" gutterBottom>
        Company Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The company you are trying to access does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </Container>
  );
}