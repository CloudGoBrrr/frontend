import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import rest from "../../common/rest";

const authContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  const signin = (token, userDetails, next) => {
    setToken(token);
    setUserDetails(userDetails);
    localStorage.setItem("token", token);
    if (next) {
      navigate(next);
    } else {
      navigate("/c/files");
    }
  };

  const signout = () => {
    rest.delete(window.CLOUDGOBRRR.API_URL + "/v1/auth/session", true, {
      id: userDetails.sessionId,
    });
    setToken("");
    setUserDetails({});
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <authContext.Provider
      value={{ token, userDetails, signin, signout, setUserDetails }}
    >
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};
