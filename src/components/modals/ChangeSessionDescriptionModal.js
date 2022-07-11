import { useRef, useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import { If, Loader } from "../../components/common";
import rest from "../../common/rest";

const ChangeSessionDescriptionModal = (props) => {
  const descriptionInput = useRef(null);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (props.show) {
      setDescription(props.description || "");
      descriptionInput.current.focus();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  const handleChange = (e) => {
    e.preventDefault();
    if (description.length === 0) {
      props.handleClose();
      return;
    }
    setIsLoading(true);
    rest
      .post(`/v1/auth/session/description`, true, {
        sessionId: props.sessionId,
        newDescription: description,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.details.status === 200) {
          setDescription("");
          props.handleFinish();
        } else {
          const tmp = res.data.error;
          setErrorMessage(tmp[0].toUpperCase() + tmp.slice(1));
          setError(true);
          descriptionInput.current.focus();
        }
      });
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Description</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <If condition={error}>
          <Alert variant="danger" onClose={() => setError(false)} dismissible>
            {errorMessage}
          </Alert>
        </If>
        <Form onSubmit={handleChange}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.description}
              autoFocus
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              ref={descriptionInput}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleChange} disabled={isLoading}>
          <Loader isLoading={isLoading} text="Change!" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeSessionDescriptionModal;
