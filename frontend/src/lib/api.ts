import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("df_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      typeof window !== "undefined" &&
      err?.response?.status === 401 &&
      !String(err?.config?.url || "").includes("/api/auth/login") &&
      !String(err?.config?.url || "").includes("/api/auth/register")
    ) {
      localStorage.removeItem("df_token");
      window.location.href = "/access";
    }
    return Promise.reject(err);
  }
);
