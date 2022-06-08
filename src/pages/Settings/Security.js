import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { useAuth } from "../../components/context/AuthContext";

import { If } from "../../components/common";

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

  const [sessionsList, setSessionsList] = useState([]);

  useEffect(() => {
    loadSessions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSessions = async () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/v1/auth/token/list", {
        headers: { Authorization: auth.token },
      })
      .then((res) => {
        setSessionsList(res.data.tokens.reverse());
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

  const handleDeleteSession = (tokenID) => {
    if (tokenID === auth.userDetails.tokenID) {
      auth.signout();
    } else {
      axios
        .delete(
          process.env.REACT_APP_API_URL + "/v1/auth/token?id=" + tokenID,
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
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3">
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
              {!passwordChangeIsLoading ? "Submit" : "Loading..."}
            </Button>{" "}
            <Form.Text className="text-muted">
              Changing your password will log you out of all sessions.
            </Form.Text>
          </Card.Footer>
        </Form>
      </Card>
      <hr />
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
                {auth.userDetails.tokenID === session.id
                  ? (<>{" "}<span className="text-muted">(Current Session)</span></>)
                  : null}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default Security;
