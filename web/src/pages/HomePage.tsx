import { useEffect, useState } from "react";
import { TResponseClassesDetails } from "../@types";
import { ClassCard } from "../components/ClassCard";
import Header from "../components/Header";
import classesListService from "../services/ClassesListService";

export default function HomePage() {
  const [classesList, setClassesList] = useState<TResponseClassesDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadClassesList();
  }, []);

  async function loadClassesList() {
    setIsLoading(true);

    const request = await classesListService();

    setClassesList(request.data);

    setIsLoading(false);
  }

  return (
    <>
      <Header />
      <main>
        <div className="grid grid-cols-4 gap-3">
          {isLoading && <h1>Carregando...</h1>}
          {classesList.map((clazz) => (
            <ClassCard key={clazz.id} {...clazz} />
          ))}
        </div>
      </main>
    </>
  );
}
