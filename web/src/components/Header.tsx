import { Menu, Transition } from "@headlessui/react";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateClassModal from "./CreateClassModal";
import EnterClassModal from "./EnterClassModal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenEnterModal, setIsOpenEnterModal] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <h1>Error</h1>;
  }

  return (
    <>
      <header className="flex flex-row p-5 mb-3 border">
        <h1 className="text-xl font-medium">Atividade Final</h1>
        <Menu as="div" className="relative inline-block text-left ml-auto">
          <div>
            <Menu.Button className="btn-icon">
              <PlusIcon className="h-6" />
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
                      onClick={() => setIsOpenCreateModal(true)}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm w-full text-start"
                      )}
                    >
                      Criar turma
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsOpenEnterModal(true)}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm w-full text-start"
                      )}
                    >
                      Participar da turma
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <Menu as="div" className="relative inline-block text-left ml-4">
          <div>
            <Menu.Button className="btn-icon">
              <UserIcon className="h-6" />
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
                  <span className="block px-4 py-2 text-sm">{user.name}</span>
                </Menu.Item>
                <Menu.Item>
                  <span className="block px-4 py-2 text-sm">{user.email}</span>
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      // TODO : Adicionar função de logout
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm w-full"
                      )}
                    >
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </header>
      <CreateClassModal
        isOpen={isOpenCreateModal}
        setIsOpen={setIsOpenCreateModal}
      />
      <EnterClassModal
        isOpen={isOpenEnterModal}
        setIsOpen={setIsOpenEnterModal}
      />
    </>
  );
}
