import { api } from "./api";

export default async function registerService(
  name: string,
  email: string,
  password: string
) {
  return await api.post("/user", {
    name,
    email,
    password,
  });
}
