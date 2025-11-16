import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
