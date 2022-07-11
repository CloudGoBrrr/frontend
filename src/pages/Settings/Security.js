import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  ListGroup,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import TimeAgo from "javascript-time-ago";

import { useAuth } from "../../components/context/AuthContext";

import { If, Loader } from "../../components/common";
import rest from "../../common/rest";
import { ChangeSessionDescriptionModal } from "../../components/modals";

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

  const [
    showChangeSessionDescriptionModal,
    setShowChangeSessionDescriptionModal,
  ] = useState(false);
  const [
    changeSessionDescriptionModalSessionId,
    setChangeSessionDescriptionModalSessionId,
  ] = useState(0);
  const [
    changeSessionDescriptionModalDescription,
    setChangeSessionDescriptionModalDescription,
  ] = useState("");

  useEffect(() => {
    loadSessions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSessions = async () => {
    rest.get("/v1/auth/session/list", true).then((res) => {
      if (res.details.status === 200) {
        // sort sessions current session to the top
        const sortedSessions = res.data.sessions.reverse().sort((a, b) => {
          if (a.id === auth.userDetails.sessionId) {
            return -1;
          }
          if (b.id === auth.userDetails.sessionId) {
            return 1;
          }
          return 0;
        });
        setSessionsList(sortedSessions);
      }
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordChangeIsLoading(true);
    rest
      .post("/v1/auth/changepassword", true, {
        oldPassword: passwordChangeCurrentPassword,
        newPassword: passwordChangeNewPassword,
      })
      .then((res) => {
        if (res.details.status === 200) {
          setSuccessMessage(
            "Successfully changed password. You will be logged out in 5 seconds."
          );
          setError(false);
          setSuccess(true);
          setPasswordChangeIsLoading(false);
          setTimeout(() => {
            auth.signout();
          }, 5000);
        } else {
          setErrorMessage(res.data.error);
          setError(true);
          setSuccess(false);
          setPasswordChangeIsLoading(false);
        }
      });
  };

  const handleDeleteSession = (sessionId) => {
    if (sessionId === auth.userDetails.sessionId) {
      auth.signout();
    } else {
      rest.delete("/v1/auth/session", true, { id: sessionId }).then((res) => {
        if (res.details.status === 200) {
          loadSessions();
        }
      });
    }
  };

  const handleChangeDescription = (sessionId, sessionDescription) => {
    setChangeSessionDescriptionModalSessionId(sessionId);
    setChangeSessionDescriptionModalDescription(sessionDescription);
    setShowChangeSessionDescriptionModal(true);
  };

  const handleFinish = () => {
    setShowChangeSessionDescriptionModal(false);
    loadSessions();
  };

  const handleCreateBasicAuth = (e) => {
    e.preventDefault();
    setCreateBasicAuthIsLoading(true);
    rest
      .post("/v1/auth/session/basic", true, {
        description: createBasicAuthDescription,
      })
      .then((res) => {
        if (res.details.status === 200) {
          setCreateBasicAuthSuccessPassword(res.data.password);
          setCreateBasicAuthSuccess(true);
          setCreateBasicAuthIsLoading(false);
          setCreateBasicAuthDescription("");
          loadSessions();
        } else {
          setErrorMessage(res.data.error);
          setError(true);
          setSuccess(false);
          setCreateBasicAuthIsLoading(false);
        }
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
                placeholder="&#9679;&#9679;&#9679;"
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
                placeholder="&#9679;&#9679;&#9679;"
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
              <Form.Control
                type="text"
                placeholder="Description"
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
              <ListGroup.Item key={session.id} className="d-inline">
                <span className="align-middle">
                  {session.description}
                  <OverlayTrigger
                    placement="right"
                    overlay={renderTooltip(session.created_at)}
                  >
                    <span className="mx-2">
                      <FontAwesomeIcon icon={faCircleInfo} />
                    </span>
                  </OverlayTrigger>
                  {auth.userDetails.sessionId === session.id ? (
                    <>
                      <Badge bg="secondary">Current Session</Badge>
                    </>
                  ) : null}
                  <span className="float-end">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        handleChangeDescription(
                          session.id,
                          session.description
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} fixedWidth />
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        handleDeleteSession(session.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} fixedWidth />
                    </Button>
                  </span>
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      <ChangeSessionDescriptionModal
        show={showChangeSessionDescriptionModal}
        description={changeSessionDescriptionModalDescription}
        sessionId={changeSessionDescriptionModalSessionId}
        handleFinish={handleFinish}
        handleClose={() => {
          setShowChangeSessionDescriptionModal(false);
        }}
      />
    </>
  );
};

const renderTooltip = (createdAt) => {
  const timeAgo = new TimeAgo("en-US");
  return (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Created {timeAgo.format(Date.parse(createdAt))}
    </Tooltip>
  );
};

export default Security;
