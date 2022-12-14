import { api } from "./api";

export default async function validateAuthService() {
  return await api.get("/auth/validate");
}
