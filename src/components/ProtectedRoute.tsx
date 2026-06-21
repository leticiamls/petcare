import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../lib/auth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!auth.isAuthenticated()) return <Navigate to="/" replace />;
  return children;
};
