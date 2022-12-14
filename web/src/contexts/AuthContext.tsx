import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import loginService from "../services/LoginService";
import validateAuthService from "../services/ValidateAuthService";

type TUser = {
  id: string;
  name: string;
  email: string;
};

type TAuthContext = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  handleLogin(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<void>;
};

const AuthContext = React.createContext({} as TAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(() => {
    const { token } = JSON.parse(localStorage.getItem("auth") || "{}");

    return token;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TUser | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    if (!token) {
      setIsLoading(false);
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    handleAuthValidate();
  }, []);

  async function handleAuthValidate() {
    try {
      const request = await validateAuthService();
      setUser(request.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }

  async function handleLogin(
    email: string,
    password: string,
    rememberMe: boolean
  ) {
    setIsLoading(true);

    try {
      const request = await loginService(email, password);

      const { token, refresh_token } = await request.data;

      if (rememberMe) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            token,
            refresh_token,
          })
        );
      }

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setToken(token);
      handleAuthValidate();

      navigate("/");

      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }

    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{ isLoading, user, isAuthenticated, handleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
