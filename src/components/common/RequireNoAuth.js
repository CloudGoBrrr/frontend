import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RequireNoAuth = ({ children }) => {
  const auth = useAuth();

  return auth.token ?  <Navigate to="/c/files" /> : children;
};

export default RequireNoAuth;