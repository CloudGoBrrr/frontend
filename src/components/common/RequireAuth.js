import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.token) {
    return children;
  } else {
    const to = "/signin?next=" + location.pathname + location.search;

    return <Navigate to={to} />;
  }
};

export default RequireAuth;