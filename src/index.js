import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import "./css/style.css";

import { AuthProvider } from "./components/context/AuthContext";
import { UploadProvider } from "./components/context/UploadContext";
import { FeatureFlagsProvider } from "./components/context/FeatureFlagContext";

import { RequireAuth, RequireNoAuth } from "./components/common";

import Layout from "./pages/Layout";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Files from "./pages/Files";
import Settings from "./pages/Settings";
import NoPage from "./pages/NoPage";

export default function App() {
  TimeAgo.addDefaultLocale(en);

  return (
    <BrowserRouter>
      <FeatureFlagsProvider>
        <AuthProvider>
          <UploadProvider>
            <Routes>
              <Route index element={<Navigate to="/signin" />} />
              <Route
                path="signin"
                element={
                  <RequireNoAuth>
                    <Signin />
                  </RequireNoAuth>
                }
              />
              <Route
                path="signup"
                element={
                  <RequireNoAuth>
                    <Signup />
                  </RequireNoAuth>
                }
              />
              <Route
                path="/c/"
                element={
                  <RequireAuth>
                    <Layout />
                  </RequireAuth>
                }
              >
                <Route path="files" element={<Files />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NoPage />} />
            </Routes>
          </UploadProvider>
        </AuthProvider>
      </FeatureFlagsProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// ToDo: preview for files (image etc)
