import { LockClosedIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import enterClassService from "../services/EnterClassService";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  code: z
    .string()
    .min(5, "Deve ter no minimo 5 caracteres")
    .max(128, "Deve ter no maximo 128 caracteres"),
});

type TInputs = z.infer<typeof formSchema>;

export default function CreateClassModal({ isOpen, setIsOpen }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TInputs>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });

  async function onSubmit({ code }: TInputs) {
    setIsLoading(true);

    try {
      await enterClassService(code);
      setIsOpen(false);

      window.location.reload();
    } catch (error) {
      toast.error("Não encontramos nenhuma sala com este código", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Modal onclosed={() => setIsOpen(false)} isOpen={isOpen}>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Participe de uma turma
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <input type="hidden" name="remember" defaultValue="true" />
              <div>
                <label htmlFor="class-code" className="sr-only">
                  Nome
                </label>
                <input
                  id="class-code"
                  type="class-code"
                  autoComplete="class-code"
                  {...register("code")}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Código da sala"
                />
                <span className="text-red-500 text-sm">
                  {errors.code?.message}
                </span>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 rounded-full bg-white animate-ping"></div>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
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
    </>
  );
}
