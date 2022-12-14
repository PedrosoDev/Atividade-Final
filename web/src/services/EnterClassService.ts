import { api } from "./api";

export default async function createClassService(code: string) {
  return await api.post(`/user/class/${code}`);
}
