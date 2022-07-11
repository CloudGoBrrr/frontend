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

  let timeout;

  useEffect(() => {
    axios.get(window.CLOUDGOBRRR.API_URL + "/v1/healthcheck").catch((res) => {
      setErrorMessage("API is not responding");
      setError(true);
    });

    if (localStorage.getItem("token") !== null) {
      handleDetails();
    } else {
      setShow(true);
    }

    // This Effect should only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowSignup(featureFlags.getFeatureFlag("PUBLIC_REGISTRATION"));
  }, [featureFlags, featureFlags.featureFlags]);

  const handleSignin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    axios
      .post(window.CLOUDGOBRRR.API_URL + "/v1/auth/signin", {
        username: username,
        password: password,
        description: "Web Signin on " + browser.getBrowser(),
      })
      .then((res) => {
        const token = res.data.token;
        axios
          .get(window.CLOUDGOBRRR.API_URL + "/v1/auth/details", {
            headers: { Authorization: token },
          })
          .then((res) => {
            setIsLoading(false);
            auth.signin(token, res.data.userDetails, searchParams.get("next"));
          });
      })
      .catch((err) => {
        setIsLoading(false);
        setError(true);
        setErrorMessage("Invalid username or password");
      });
  };

  const handleDetails = () => {
    setIsLoading(true);
    axios
      .get(window.CLOUDGOBRRR.API_URL + "/v1/auth/details", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setIsLoading(false);
        auth.signin(
          localStorage.getItem("token"),
          res.data.userDetails,
          searchParams.get("next")
        );
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
            handleDetails();
          }, 1000);
        }
      });
  };

  return (
    <>
      <If condition={show}>
        <Card className="cloud-sign-card">
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
