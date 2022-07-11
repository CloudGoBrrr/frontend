import { useEffect, useState, useRef } from "react";

import { Alert, Modal, Form, Button } from "react-bootstrap";

import { If, Loader } from "../common";
import rest from "../../common/rest";

const NewFolderModal = (props) => {
  const folderInput = useRef(null);
  const [folderName, setFolderName] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.show) {
      setFolderName("");
      folderInput.current.focus();
    }
  }, [props.show]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (folderName.length > 0) {
      setIsLoading(true);
      rest
        .post(`/v1/folder`, true, {
          path: props.filePath,
          name: folderName,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.details.status === 200) {
            props.handleFinish();
          } else {
            const tmp = res.data.error;
            setErrorMessage(tmp[0].toUpperCase() + tmp.slice(1));
            setError(true);
            folderInput.current.focus();
          }
        });
    }
  };

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
