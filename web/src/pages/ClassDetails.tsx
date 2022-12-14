import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { TResponseClassesDetails } from "../@types";
import Header from "../components/Header";
import classDetailsService from "../services/ClassDetailsService";

export default function ClassDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TResponseClassesDetails>(
    {} as TResponseClassesDetails
  );

  const { slug } = useParams();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const request = await classDetailsService(slug!);

    setData(await request.data);
    setIsLoading(false);
  }

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Header />
      <main className="xl:max-w-4xl container mx-auto">
        <div className="flex flex-col p-4 bg-indigo-600 text-white border rounded">
          <h1 className="text-xl font-medium">{data.name}</h1>
          <h2 className="mt-20">Profesor: {data.teacherName}</h2>
          <h3 className="text-sm">Código da sala: {data.code}</h3>
        </div>
        {data.posts.length < 1 && <span>Está sala não possui posts</span>}
        {data.posts.map((post) => (
          <div>
            <h1>{post.title}</h1>
            <desc>{post.content}</desc>
          </div>
        ))}
      </main>
    </>
  );
}
