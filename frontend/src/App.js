import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UsersList";
import AdminStats from "./pages/AdminStats";
import AreaManagement from "./pages/AreaManagement";
import Register from "./pages/Register";
import Company404 from "./pages/Company404";
import Company404Wrapper from "./pages/Company404Wrapper";
import { BrandingContext } from './context/BrandingContext';



function App() {
  const { companyColor } = useContext(BrandingContext);
  const theme = createTheme({
    palette: {
      primary: {
        main: companyColor || "#2196f3",  // default blue
      },
    },
  });
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} /> 
          <Route path="/admin-stats" element={<AdminStats />} />
          <Route path="/areas" element={<AreaManagement />} />
          <Route path="/404" element={<Company404 />} />
          <Route
            path="/:slug/*"
            element={<Company404Wrapper />}
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
