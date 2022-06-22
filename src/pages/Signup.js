import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Alert, Button, Card, Form } from "react-bootstrap";

import { If } from "../components/common";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match");
      setError(true);
      return;
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/v1/auth/signup", {
        username: username,
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.status === "ok") {
          setError(false);
          setErrorMessage("");
          setSuccess(true);
          setTimeout(() => {
            navigate("/signin");
          }, 5000);
        }
      })
      .catch((err) => {
        const tmp = err.response.data.error;
        setErrorMessage(tmp[0].toUpperCase() + tmp.slice(1));
        setError(true);
      });
  };

  return (
    <Card className="cloud-sign-card">
      <Card.Header as="h3">Signup</Card.Header>
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
        <If condition={success}>
          <Alert key="success" variant="success">
            Congrats! You have successfully signed up. You will be redirected to
            the login page in 5 seconds.
          </Alert>
        </If>
        <Form onSubmit={handleSignup}>
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
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Go!
          </Button>
        </Form>
      </Card.Body>
      <Card.Footer>
        Already got an account? Then <Link to="/signin">signin!</Link>
      </Card.Footer>
    </Card>
  );
};

export default Signup;
