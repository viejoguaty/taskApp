import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from "../services/api";
import { BrandingContext } from '../context/BrandingContext';
import Register from "../pages/Register";

import {
  Box,
  CircularProgress,
  TextField,
  Button,
  Typography,
  Drawer,
  Container
} from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { branding, setBranding } = useContext(BrandingContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [allowRegister, setAllowRegister] = useState(false);
  const [open, setOpen] = React.useState(false);

  /*useEffect(() => {
    api.get("/config").then(res => {
      setAllowRegister(res.data.allow_registration);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          const company = res.data.company;
          setBranding({
            companyColor: company.color,
            companyName: company.name,
            companyLogo: company.logo,
            companyId: company.id
          });
          navigate('/dashboard');
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await api.get(`/companies/by-slug/${slug}`);
        sessionStorage.setItem("company_id", res.data.id);
        setCompany(res.data);
        dispatch(setBranding(res.data)); // opcional si usas Redux
      } catch (err) {
        console.error("Company not found");
        navigate("/404");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [slug]); */

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('/login', credentials);
      localStorage.setItem('token', res.data.access_token);

      const me = await axios.get('/me', {
        headers: { Authorization: `Bearer ${res.data.access_token}` }
      });

      const company = me.data.company;
      setBranding({
        companyColor: company.color,
        companyName: company.name,
        companyLogo: company.logo,
        companyId: company.id
      });

      navigate('/dashboard');
    } catch (err) {
      alert('Error al iniciar sesión');
    }
  };

  if (!loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (

    <Container maxWidth="sm" sx={{ height: '100vh' }} className="center-box">
        <Box p={4} sx={{ bgcolor: '#cfe8fc'}}>
          {!branding.companyLogo && (
            <Box mb={2} textAlign="center">
              <img 
                src="https://images.ctfassets.net/0uuz8ydxyd9p/2W8B7bcLSPX9YaSwkfrhmv/eade3fc61520b8cee84cf8605dce3056/Temporal_Symbol_dark_1_2x.png" 
                alt="Logo" 
                style={{ maxHeight: '85px' }} />
            </Box>
          )}
          <Typography variant="h5" gutterBottom textAlign="center">
            Welcome back to {branding.companyName || 'TaskApp'}
          </Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            margin="normal"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, backgroundColor: branding.companyColor }}
            onClick={handleLogin}
          >
            Login
          </Button>

          {!allowRegister && (
            <>
              <Button 
                onClick={toggleDrawer("right", true)} 
                textAlign="center"
                sx={{ minWidth: "100%", mt:2}}
              >
                  Register
                </Button>
              <Drawer open={open} onClose={toggleDrawer(false)}>
                <Register setOpen={setOpen}/>
              </Drawer>
            </>
          )}
        </Box>
    </Container>
  );
};
