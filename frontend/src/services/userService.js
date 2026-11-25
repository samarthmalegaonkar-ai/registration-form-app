import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export async function registerUser(user) {
  const response = await api.post("/users", user);
  return response.data;
}

export async function getUsers() {
  const response = await api.get("/users");
  return response.data;
}
