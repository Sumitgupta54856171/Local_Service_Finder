import axios, { AxiosError } from "axios";

const getBaseURL = () =>
  typeof window !== "undefined" ? "/api-backend" : "http://localhost:8000";

const api = axios.create({ baseURL: getBaseURL() });

export async function getPublicServices() {
  const { data } = await api.get("api/v1/public/", { withCredentials: true });
  return data;
}