import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

import { Alert, Form, Button, Card, Spinner } from "react-bootstrap";

import { useAuth } from "../components/context/AuthContext";
import { useFeatureFlags } from "../components/context/FeatureFlagContext";
import { If, Loader } from "../components/common";

import browser from "../common/browser";

function Login() {
  const auth = useAuth();
  const featureFlags = useFeatureFlags();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [showSignup, setShowSignup] = useState(false);

  var timeout;

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/v1/healthcheck")
      .catch((res) => {
        setErrorMessage("API is not responding");
        setError(true);
      });

    handleToken();

    // This Effect should only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowSignup(featureFlags.getFeatureFlag("PUBLIC_REGISTRATION"));
  }, [featureFlags, featureFlags.featureFlags]);

  const handleToken = () => {
    if (localStorage.getItem("token") !== null) {
      setIsLoading(true);
      axios
        .get(process.env.REACT_APP_API_URL + "/v1/auth/details", {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((res) => {
          if (res.data.status === "ok") {
            setIsLoading(false);
            auth.signin(
              localStorage.getItem("token"),
              res.data.userDetails,
              searchParams.get("next")
            );
          }
        })
        .catch((err) => {
          if (err.code !== "ERR_NETWORK") {
            setErrorMessage("Invalid token");
            setError(true);
            setIsLoading(false);
            auth.signout();
            setShow(true);
          } else {
            setError(true);
            timeout = setTimeout(() => {
              handleToken();
            }, 1000);
          }
        });
    } else {
      setShow(true);
    }
  };

  const handleSignin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    axios
      .post(process.env.REACT_APP_API_URL + "/v1/auth/signin", {
        username: username,
        password: password,
        description: "Web Signin on " + browser.getBrowser(),
      })
      .then((res) => {
        if (res.data.status === "ok") {
          const token = res.data.token;
          axios
            .get(process.env.REACT_APP_API_URL + "/v1/auth/details", {
              headers: { Authorization: token },
            })
            .then((res) => {
              if (res.data.status === "ok") {
                setIsLoading(false);
                auth.signin(
                  token,
                  res.data.userDetails,
                  searchParams.get("next")
                );
              }
            });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError(true);
        setErrorMessage("Invalid username or password");
      });
  };

  return (
    <>
      <If condition={show}>
        <Card
          style={{
            maxWidth: "35rem",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "1em",
          }}
        >
          <Card.Header as="h3">Signin</Card.Header>
          <Card.Body>
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
            <Form onSubmit={handleSignin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isLoading}>
                <Loader isLoading={isLoading} text="Go!" />
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer>
            <If condition={showSignup}>
              No account? Go <Link to="/signup">signup!</Link> -{" "}
            </If>
            API Version: {featureFlags.version}
          </Card.Footer>
        </Card>
      </If>
      <If condition={!show}>
        <Spinner className="cloud-middle" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <If condition={error}>
          <Alert key="danger" variant="danger" className="m-3">
            API is not responding{" "}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                auth.signout();
                setIsLoading(false);
                clearTimeout(timeout);
              }}
            >
              Clear session
            </Button>
          </Alert>
        </If>
      </If>
    </>
  );
}

export default Login;
