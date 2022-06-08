import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    axios.delete(process.env.REACT_APP_API_URL + "/v1/auth/token?id=" + userDetails.tokenID, {
      headers: { Authorization: token },
    });

    setToken("");
    setUserDetails({});
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <authContext.Provider value={{ token, userDetails, signin, signout, setUserDetails }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};