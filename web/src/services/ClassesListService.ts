import { api } from "./api";
import { TResponseClassesDetails } from "../@types";

export default async function classesListService() {
  return await api.get<TResponseClassesDetails[]>("/class");
}
