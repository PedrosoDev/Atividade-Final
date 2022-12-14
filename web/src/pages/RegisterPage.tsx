import { LockClosedIcon } from "@heroicons/react/20/solid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import registerService from "../services/RegisterService";
import { useAuth } from "../contexts/AuthContext";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Deve ter no minimo 3 caracteres")
    .max(128, "Deve ter no maximo 128 caracteres"),
  email: z.string().email("Deve ser um email valido"),
  password: z
    .string()
    .min(8, "Deve ter no minimo 8 caracteres")
    .max(128, "Deve ter no maximo 128 caracteres"),
  rememberMe: z.boolean(),
});

type TInputs = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { handleLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TInputs>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function onSubmit({ name, email, password, rememberMe }: TInputs) {
    setIsLoading(true);
    setEmailError("");

    try {
      await registerService(name, email, password);
      await handleLogin(email, password, rememberMe);
    } catch (error) {
      setEmailError("Este email já está cadastrado");
      return;
    }

    setIsLoading(false);
  }

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crie uma conta
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md">
            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>
              <input
                id="name"
                type="name"
                autoComplete="name"
                {...register("name")}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Nome"
              />
              <span className="text-red-500 text-sm">
                {errors.name?.message}
              </span>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                {...register("email")}
                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email"
              />
              <span className="text-red-500 text-sm">
                {errors.email?.message || emailError}
              </span>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                {...register("password")}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Senha"
              />
              <span className="text-red-500 text-sm">
                {errors.password?.message}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Lembrar de mim
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              {isLoading ? (
                <div className="h-4 w-4 rounded-full bg-white animate-ping"></div>
              ) : (
                "Registrar"
              )}
            </button>
          </div>
          <div>
            <span>
              Já possui uma conta?
              <Link
                to="/auth/login"
                replace
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {" "}
                Entre!
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
