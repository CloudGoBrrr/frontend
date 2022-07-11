import { createContext, useContext, useState, useRef } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

import useSynchronousState from "../../common/useSynchronousState";
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

    axios
      .put(window.CLOUDGOBRRR.API_URL + "/v1/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth.token,
          "Content-Range": `bytes ${offset}-${offset + chunkSize - 1}/${
            file.size
          }`,
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(
            Math.round(((offset + progressEvent.loaded) / file.size) * 100)
          );
        },
      })
      .then((res) => {
        if (res.status === 202) {
          uploadChunk(file, offset + chunkSize);
        } else if (res.status === 200) {
          // finish state of uploading
          const parsed = path.parse(file.path);
          if (parsed.dir !== "") {
            axios
              .post(
                window.CLOUDGOBRRR.API_URL + "/v1/folder",
                {
                  path: file.uploadPath,
                  name: parsed.dir,
                },
                {
                  headers: {
                    Authorization: auth.token,
                  },
                }
              )
              .then((res) => {
                finishUploading(file, parsed);
              })
              .catch((err) => {
                console.log(err);
                finishUploading(file, parsed);
              });
          } else {
            finishUploading(file, parsed);
          }
        } else {
          alert("Upload failed");
          clearQueue();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Upload failed");
        clearQueue();
      });
  }

  const finishUploading = (file, parsed) => {
    axios
      .post(
        window.CLOUDGOBRRR.API_URL + "/v1/file/upload",
        {
          path: path.join(file.uploadPath, parsed.dir),
          name: file.name,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          callback.current(file.uploadPath);
          setUploadState(false);
          startUpload();
        } else {
          alert("File is corrupted");
          clearQueue();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred");
        clearQueue();
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
