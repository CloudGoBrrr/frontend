import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { Alert, Modal, Form, Button } from "react-bootstrap";

import { useAuth } from "../context/AuthContext";

import { If, Loader } from "../common";

const NewFolderModal = (props) => {
  const folderInput = useRef(null);
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const handleCreate = (e) => {
    e.preventDefault();
    if (folderName.length > 0) {
      setIsLoading(true);
      axios
        .post(
          process.env.REACT_APP_API_URL + `/v1/folder`,
          {
            path: props.filePath,
            name: folderName,
          },
          {
            headers: {
              Authorization: auth.token,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setIsLoading(false);
            props.handleFinish();
          }
        })
        .catch((err) => {
          const tmp = err.response.data.error;
          setErrorMessage(tmp[0].toUpperCase() + tmp.slice(1));
          setError(true);
          setIsLoading(false);
          folderInput.current.focus();
        });
    }
  };

  useEffect(() => {
    if (props.show) {
      setFolderName("");
      folderInput.current.focus();
    }
  }, [props.show]);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <If condition={error}>
          <Alert variant="danger" onClose={() => setError(false)} dismissible>
            {errorMessage}
          </Alert>
        </If>
        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="New Folder (1)"
              autoFocus
              onChange={(e) => setFolderName(e.target.value)}
              value={folderName}
              ref={folderInput}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreate} disabled={isLoading}>
          <Loader isLoading={isLoading} text="Create!" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewFolderModal;
