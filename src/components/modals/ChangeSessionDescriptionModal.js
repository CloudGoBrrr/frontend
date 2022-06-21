import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import { If, Loader } from "../../components/common";
import { useAuth } from "../context/AuthContext";

const ChangeSessionDescriptionModal = (props) => {
  const auth = useAuth();
  const descriptionInput = useRef(null);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .put(
        process.env.REACT_APP_API_URL + `/v1/auth/session/description`,
        {
          sessionId: props.sessionId,
          newDescription: description,
        },
        {
          headers: { Authorization: auth.token },
        }
      )
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          setDescription("");
          props.handleFinish();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        const tmp = err.response.data.error;
        setErrorMessage(tmp[0].toUpperCase() + tmp.slice(1));
        setError(true);
        descriptionInput.current.focus();
      });
  };

  useEffect(() => {
    if (props.show) {
      setDescription(props.description);
      descriptionInput.current.focus();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

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
              placeholder="..."
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
          <Loader isLoading={isLoading} text="Create!" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeSessionDescriptionModal;
