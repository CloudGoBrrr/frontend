import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import path from "path-browserify";

import { Dropdown, DropdownButton, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faUpload,
  faRainbow,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../components/context/AuthContext";
import { useUpload } from "../components/context/UploadContext";
import {
  UploadModal,
  NewFolderModal,
  DeleteFileModal,
} from "../components/modals";
import { FileBreadcrumb, FileItem } from "../components/files";
import useInterval from "../common/useInterval";

const Files = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filePath, setFilePath] = useState(searchParams.get("path") || "/");
  const [files, setFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAlreadyDragging, setIsAlreadyDragging] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [deleteFileModalFileName, setDeleteFileModalFileName] = useState("");

  const auth = useAuth();
  const upload = useUpload();
  const navigate = useNavigate();

  const { getRootProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
  });

  // Load logic
  const loadFiles = (path) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/v1/files/list", {
        params: {
          path: path,
        },
        headers: {
          Authorization: auth.token,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          let tmp = [];
          if (path !== "/") {
            tmp.push({
              Name: "..",
              Type: "up",
              Size: "",
              Modified: "",
            });
          }
          // Sort files by name, first directories, then files
          res.data.files.sort((a, b) => {
            if (a.Type === "dir" && b.Type !== "dir") {
              return -1;
            } else if (a.Type !== "dir" && b.Type === "dir") {
              return 1;
            } else {
              return a.Name.localeCompare(b.Name);
            }
          });
          setFiles(tmp.concat(res.data.files));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          auth.signout();
        } else if (err.code === "ERR_NETWORK") {
          navigate(0);
        }
      });
  };

  useInterval(() => {
    // Load files every 2.5 seconds
    // will keep it updated if user is still on the page
    loadFiles(filePath);
  }, 2500);

  useEffect(() => {
    loadFiles(filePath);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filePath]);

  useEffect(() => {
    setFilePath(searchParams.get("path") || "/");
  }, [searchParams]);

  useEffect(() => {
    upload.setCallback((path) => {
      loadFiles(path);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDragActive) {
      setIsAlreadyDragging(true);
      setShowUploadModal(true);
    }
  }, [isDragActive]);

  //Handle logic
  const handleFileClick = (file) => {
    if (file.Type === "dir" || file.Type === "up") {
      const tmp = path.join(filePath, file.Name);
      setSearchParams({ path: tmp });
    }
  };

  const handleFileDelete = (file) => {
    setDeleteFileModalFileName(file.Name);
    setShowDeleteFileModal(true);
  };

  const handleFileDownload = (file) => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/v1/files/download",
        {
          path: filePath,
          name: file.Name,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const link = document.createElement("a");
          link.setAttribute(
            "href",
            process.env.REACT_APP_API_URL +
              "/v1/files/download?secret=" +
              res.data.secret
          );
          link.setAttribute("download", file.Name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  };

  const handleFinish = () => {
    setShowDeleteFileModal(false);
    setShowNewFolderModal(false);
    setShowUploadModal(false);
    setIsAlreadyDragging(false);
    loadFiles(filePath);
  };

  // needed because table would not render correctly when empty
  const tableIcon = process.env.NODE_ENV === "production" ? faRainbow : faCode;

  return (
    <>
      <FileBreadcrumb filePath={filePath} />
      <Table striped hover className="cloud-files" {...getRootProps()}>
        <thead>
          <tr>
            <th className="cloud-files-table-2">
              <DropdownButton size="sm" title="">
                <Dropdown.Item
                  onClick={() => {
                    setShowNewFolderModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faFolderPlus} fixedWidth /> New Folder
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setShowUploadModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faUpload} fixedWidth /> Upload
                </Dropdown.Item>
              </DropdownButton>
            </th>
            <th className="cloud-files-table-2 text-center">
              <FontAwesomeIcon icon={tableIcon} fixedWidth />
            </th>
            <th className="cloud-files-table-60">Name</th>
            <th className="cloud-files-table-6"></th>
            <th className="cloud-files-table-15">Size</th>
            <th className="cloud-files-table-15 cloud-files-not-needed">
              Modified
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <FileItem
              key={index}
              handleClick={handleFileClick}
              handleDelete={handleFileDelete}
              handleDownload={handleFileDownload}
              file={file}
            />
          ))}
        </tbody>
      </Table>
      <div className="cloud-files-backzone" {...getRootProps()}></div>
      <UploadModal
        show={showUploadModal}
        handleClose={() => {
          setIsAlreadyDragging(false);
          setShowUploadModal(false);
        }}
        handleFinish={handleFinish}
        filePath={filePath}
        isAlreadyDragging={isAlreadyDragging}
      />
      <NewFolderModal
        show={showNewFolderModal}
        handleClose={() => {
          setShowNewFolderModal(false);
        }}
        handleFinish={handleFinish}
        filePath={filePath}
      />
      <DeleteFileModal
        show={showDeleteFileModal}
        handleClose={() => {
          setShowDeleteFileModal(false);
        }}
        handleFinish={handleFinish}
        filePath={filePath}
        fileName={deleteFileModalFileName}
      />
    </>
  );
};

export default Files;

// ToDo: move inline styles to css file
