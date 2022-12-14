import { api } from "./api";

export default async function enterClassService(name: string) {
  return await api.post("/class", { name });
}
