import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { useAuth } from "../../components/context/AuthContext";

import { If, Loader } from "../../components/common";

const Security = () => {
  const auth = useAuth();
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordChangeCurrentPassword, setPasswordChangeCurrentPassword] =
    useState("");
  const [passwordChangeNewPassword, setPasswordChangeNewPassword] =
    useState("");
  const [passwordChangeIsLoading, setPasswordChangeIsLoading] = useState(false);

  const [createBasicAuthDescription, setCreateBasicAuthDescription] =
    useState("");
  const [createBasicAuthIsLoading, setCreateBasicAuthIsLoading] =
    useState(false);
  const [createBasicAuthSuccess, setCreateBasicAuthSuccess] = useState(false);
  const [createBasicAuthSuccessPassword, setCreateBasicAuthSuccessPassword] =
    useState("");

  const [sessionsList, setSessionsList] = useState([]);

  useEffect(() => {
    loadSessions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSessions = async () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/v1/auth/session/list", {
        headers: { Authorization: auth.token },
      })
      .then((res) => {
        setSessionsList(res.data.sessions.reverse());
      });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordChangeIsLoading(true);
    axios
      .post(
        process.env.REACT_APP_API_URL + "/v1/auth/changepassword",
        {
          oldPassword: passwordChangeCurrentPassword,
          newPassword: passwordChangeNewPassword,
        },
        {
          headers: { Authorization: auth.token },
        }
      )
      .then((res) => {
        setSuccessMessage(
          "Successfully changed password. You will be logged out in 5 seconds."
        );
        setError(false);
        setSuccess(true);
        setPasswordChangeIsLoading(false);
        setTimeout(() => {
          auth.signout();
        }, 5000);
      })
      .catch((err) => {
        setErrorMessage(err.response.data.error);
        setError(true);
        setSuccess(false);
        setPasswordChangeIsLoading(false);
      });
  };

  const handleDeleteSession = (sessionId) => {
    if (sessionId === auth.userDetails.sessionId) {
      auth.signout();
    } else {
      axios
        .delete(
          process.env.REACT_APP_API_URL + "/v1/auth/session?id=" + sessionId,
          {
            headers: { Authorization: auth.token },
          }
        )
        .then((res) => {
          loadSessions();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCreateBasicAuth = (e) => {
    e.preventDefault();
    setCreateBasicAuthIsLoading(true);
    axios
      .post(
        process.env.REACT_APP_API_URL + "/v1/auth/session/basic",
        {
          description: createBasicAuthDescription,
        },
        {
          headers: { Authorization: auth.token },
        }
      )
      .then((res) => {
        setCreateBasicAuthSuccessPassword(res.data.password);
        setCreateBasicAuthSuccess(true);
        setCreateBasicAuthIsLoading(false);
        setCreateBasicAuthDescription("");
        loadSessions();
      })
      .catch((err) => {
        setErrorMessage(err.response.data.error);
        setError(true);
        setSuccess(false);
        setCreateBasicAuthIsLoading(false);
      });
  };

  return (
    <>
      <If condition={success}>
        <Alert
          key="success"
          variant="success"
          onClose={() => setSuccess(false)}
          dismissible
        >
          {successMessage}
        </Alert>
      </If>
      <If condition={error}>
        <Alert
          key="danger"
          variant="danger"
          onClose={() => setError(false)}
          dismissible
        >
          {errorMessage}
        </Alert>
      </If>

      <Card>
        <Card.Header>Change Password</Card.Header>
        <Form onSubmit={handlePasswordChange}>
          <Card.Body>
            <Form.Group>
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="***"
                value={passwordChangeCurrentPassword}
                onChange={(e) =>
                  setPasswordChangeCurrentPassword(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="***"
                value={passwordChangeNewPassword}
                onChange={(e) => setPasswordChangeNewPassword(e.target.value)}
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Button type="submit" disabled={passwordChangeIsLoading}>
              <Loader isLoading={passwordChangeIsLoading} text="Submit" />
            </Button>{" "}
            <Form.Text className="text-muted">
              Changing your password will log you out of all sessions.
            </Form.Text>
          </Card.Footer>
        </Form>
      </Card>
      <hr />
      <Card className="mb-3">
        <Card.Header>Basic Auth</Card.Header>
        <Form onSubmit={handleCreateBasicAuth}>
          <If condition={createBasicAuthSuccess}>
            <Alert
              key="success"
              variant="success"
              onClose={() => setCreateBasicAuthSuccess(false)}
              dismissible
              className="mx-3 mt-3"
            >
              Successfully created basic auth.
              <br />
              Please note down the credentials as they will not be shown again.
              <br />
              <strong>Username:</strong> {auth.userDetails.username}
              <br />
              <strong>Password:</strong> {createBasicAuthSuccessPassword}
            </Alert>
          </If>
          <Card.Body>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="..."
                value={createBasicAuthDescription}
                onChange={(e) => setCreateBasicAuthDescription(e.target.value)}
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Button type="submit" disabled={createBasicAuthIsLoading}>
              <Loader isLoading={createBasicAuthIsLoading} text="Create!" />
            </Button>
          </Card.Footer>
        </Form>
      </Card>
      <Card>
        <Card.Header>Sessions</Card.Header>
        <Card.Body>
          <ListGroup>
            {sessionsList.map((session) => (
              <ListGroup.Item key={session.id}>
                {session.description} -{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    handleDeleteSession(session.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} fixedWidth /> Delete Session
                </Button>
                {auth.userDetails.sessionId === session.id ? (
                  <>
                    {" "}
                    <span className="text-muted">(Current Session)</span>
                  </>
                ) : null}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default Security;
