import { api } from "./api";

export default async function loginService(email: string, password: string) {
  return await api.post("/auth/login", { email, password });
}
