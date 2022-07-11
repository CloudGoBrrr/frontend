import { useState } from "react";

import { Modal, Button } from "react-bootstrap";

import { Loader } from "../common";
import rest from "../../common/rest";

const DeleteFileModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = (e) => {
    setIsLoading(true);

    rest
      .delete(`/v1/file`, true, {
        path: props.filePath,
        name: props.fileName,
      })
      .then((res) => {
        if (res.details.status === 200) {
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
          <Loader isLoading={isLoading} text="Confirm" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteFileModal;
