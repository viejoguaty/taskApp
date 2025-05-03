import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Company404Page({ company }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 3,
      }}
    >
      {company?.logo_url && (
        <img src={company.logo_url} alt={company.name} style={{ height: 80, marginBottom: 16 }} />
      )}
      <Typography variant="h3" color="primary" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you are looking for doesn't exist within <strong>{company?.name}</strong>.
      </Typography>
      <Button variant="contained" onClick={() => navigate(`/${company?.slug}/dashboard`)}>
        Go to Dashboard
      </Button>
    </Box>
  );
}
