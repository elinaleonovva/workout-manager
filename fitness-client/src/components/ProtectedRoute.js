import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthProvider);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
