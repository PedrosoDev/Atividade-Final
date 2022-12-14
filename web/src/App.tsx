import { PropsWithChildren, useEffect } from "react";
import {
  redirect,
  RouteProps,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ClassDetails from "./pages/ClassDetails";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function Private({ children }: PropsWithChildren) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <div>{children}</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Private>
            <HomePage />
          </Private>
        }
      />
      <Route
        path="/class/:slug"
        element={
          <Private>
            <ClassDetails />
          </Private>
        }
      />
    </Routes>
  );
}
