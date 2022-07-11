import { createContext, useContext, useState, useRef } from "react";

import { useAuth } from "./AuthContext";

import useSynchronousState from "../../common/useSynchronousState";
import rest from "../../common/rest";
import path from "path-browserify";

const uploadContext = createContext();

export function UploadProvider({ children }) {
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  let [uploadState, setUploadState] = useSynchronousState(false);

  const uploadQueue = useRef([]);
  const callback = useRef(() => {});

  const auth = useAuth();

  const chunkSize = 1024 * 1024 * 10; // 10MB

  const addToQueue = (file) => {
    uploadQueue.current.push(file);
    startUpload();
  };

  const setCallback = (cb) => {
    callback.current = cb;
  };

  const startUpload = () => {
    if (!uploadState()) {
      if (uploadQueue.current.length > 0) {
        setUploadState(true);
        const tmp = uploadQueue.current.shift();

        setUploadingFile(tmp.name);
        setUploadProgress(0);

        setUploading(true);
        uploadChunk(tmp, 0);
      } else {
        setUploading(false);
      }
    }
  };

  const clearQueue = () => {
    uploadQueue.current = [];
    setUploadState(false);
    setUploading(false);
    setUploadingFile("");
    setUploadProgress(0);
  };

  function uploadChunk(file, offset) {
    const chunk = file.slice(offset, offset + chunkSize);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("name", file.name);

    let request = new XMLHttpRequest();
    request.open("PUT", window.CLOUDGOBRRR.API_URL + "/v1/file/upload");
    request.setRequestHeader("Authorization", auth.token);
    request.setRequestHeader(
      "Content-Range",
      `bytes ${offset}-${offset + chunkSize - 1}/${file.size}`
    );
    request.upload.onprogress = (e) => {
      setUploadProgress(Math.round(((offset + e.loaded) / file.size) * 100));
    };
    request.addEventListener("load", function (e) {
      if (request.status === 202) {
        uploadChunk(file, offset + chunkSize);
      } else if (request.status === 200) {
        // finish state of uploading
        finishUploading(file);
      } else {
        alert("Upload failed");
        clearQueue();
      }
    });
    request.send(formData);
  }

  const finishUploading = (file) => {
    const parsed = path.parse(file.path);
    rest
      .post("/v1/folder", true, {
        path: file.uploadPath,
        name: parsed.dir,
      })
      .then((res) => {
        rest
          .post("/v1/file/upload", true, {
            path: path.join(file.uploadPath, parsed.dir),
            name: file.name,
          })
          .then((res) => {
            if (res.details.status === 201) {
              callback.current(file.uploadPath);
              setUploadState(false);
              startUpload();
            } else {
              alert("An error occurred");
              clearQueue();
            }
          });
      });
  };

  return (
    <uploadContext.Provider
      value={{
        uploading,
        uploadingFile,
        uploadProgress,
        uploadQueue,
        addToQueue,
        setCallback,
        clearQueue,
      }}
    >
      {children}
    </uploadContext.Provider>
  );
}

export const useUpload = () => {
  return useContext(uploadContext);
};

// ToDo: 104%
