import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../services/api";

interface Props {
  children: React.ReactNode;
}

/** Wraps any page — redirects to /login if not authenticated */
export default function PrivateRoute({ children }: Props) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
