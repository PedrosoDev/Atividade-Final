import { TResponseClassesDetails } from "../@types";
import { api } from "./api";

export default async function classDetailsService(slug: string) {
  return await api.get<TResponseClassesDetails>(`/class/${slug}`);
}
