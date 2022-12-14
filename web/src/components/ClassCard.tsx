import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

type Props = {
  name: string;
  slug: string;
  code: string;
  teacherName: string;
  posts: {
    id: string;
    title: string;
    slug: string;
  }[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function ClassCard({ name, slug, code, teacherName, posts }: Props) {
  const { user } = useAuth();

  return (
    <div>
      <Link
        to={`/class/${slug}`}
        className="relative flex flex-col rounded border-2 overflow-hidden transition-transform hover:-translate-y-2 hover:shadow"
      >
        <div className="flex flex-col p-3 bg-indigo-600 text-white">
          <Menu
            as="div"
            className="absolute top-1 right-1 inline-block text-left"
          >
            <div>
              <Menu.Button className="btn-icon">
                <EllipsisVerticalIcon className="h-6" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          toast.info(
                            "Código da sala copiado para sua área de transferencia",
                            {
                              position: "bottom-right",
                              autoClose: 2000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            }
                          );
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm w-full text-start"
                        )}
                      >
                        Copiar código da sala
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <h1 className="text-xl font-medium">{name}</h1>
          <h2 className="text-sm mt-3">
            {user?.name === teacherName
              ? "Você é o professor desta sala"
              : teacherName}
          </h2>
        </div>
        <div className="flex flex-col p-3">
          <h1 className="text-lg font-medium">Posts recentes:</h1>
          {posts.length < 1 && (
            <span className="text-sm text-slate-500 ml-2">
              Está sala ainda não possui um post
            </span>
          )}
          {posts.map((post) => (
            <span key={post.id} className="text-sm ml-2">
              {post.title}
            </span>
          ))}
        </div>
      </Link>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
