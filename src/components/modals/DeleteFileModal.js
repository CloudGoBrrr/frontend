import { useState } from "react";
import axios from "axios";

import { Modal, Button } from "react-bootstrap";

import { useAuth } from "../context/AuthContext";

const DeleteFileModal = (props) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConfirm = (e) => {
    setIsLoading(true);
    var params = new URLSearchParams();
    params.append("path", props.filePath);
    params.append("name", props.fileName);

    axios
      .delete(process.env.REACT_APP_API_URL + `/v1/files`, {
        params: params,
        headers: {
          "Authorization": auth.token,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          props.handleFinish();
        }
      });
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete <code>{props.fileName}</code>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={isLoading}>
          {!isLoading ? "Confirm" : "Deleting..."}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteFileModal;
