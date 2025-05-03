import { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Grid } from "@mui/material";
import api from "../services/api";

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/tasks/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Typography>Loading stats...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Task Stats
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {Object.entries(stats.by_status).map(([status, count]) => (
          <Grid item xs={12} sm={6} md={4} key={status}>
            <Card>
              <CardContent>
                <Typography variant="h6">Status: {status}</Typography>
                <Typography variant="h5">{count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Completed Tasks by User
          </Typography>
          {Object.entries(stats.by_user).map(([email, count]) => (
            <Typography key={email}>
              {email}: {count}
            </Typography>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Tasks by Area
          </Typography>
          {Object.entries(stats.by_area).map(([area, count]) => (
            <Typography key={area}>
              {area}: {count}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
