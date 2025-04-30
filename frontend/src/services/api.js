import axios from "axios";
import { store } from "../app/store";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Automatically attach token if exists
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
