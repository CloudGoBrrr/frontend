import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const featureFlagsContext = createContext();

export function FeatureFlagsProvider(props) {
  const [featureFlags, setFeatureFlags] = useState({});
  const [version, setVersion] = useState("");

  useEffect(() => {
    axios
      .get(window.CLOUDGOBRRR.API_URL + "/v1/featureFlags")
      .then((res) => {
        for (let key in res.data.featureFlags) {
          if (res.data.featureFlags[key] === "true") {
            res.data.featureFlags[key] = true;
          } else if (res.data.featureFlags[key] === "false") {
            res.data.featureFlags[key] = false;
          }
        }
        setFeatureFlags(res.data.featureFlags);
        setVersion(res.data.version);
      })
      .catch((err) => {
        setVersion("not responding");
      });
  }, []);

  const getFeatureFlag = (key) => {
    if (featureFlags[key] === undefined) {
      return false;
    }
    return featureFlags[key];
  };

  return (
    <featureFlagsContext.Provider
      value={{ featureFlags, version, getFeatureFlag }}
    >
      {props.children}
    </featureFlagsContext.Provider>
  );
}

export const useFeatureFlags = () => {
  return useContext(featureFlagsContext);
};
