import axios from "axios";

// The frontend calls the backend through this base URL so local and deployed environments can differ safely.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});
