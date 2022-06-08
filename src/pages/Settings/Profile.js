import { InputGroup, Form, FormControl } from "react-bootstrap";

import { useAuth } from "../../components/context/AuthContext";

const Profile = () => {
  const auth = useAuth();

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          <FormControl
            aria-label="Username"
            value={auth.userDetails.username}
            disabled
          />
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <FormControl
            aria-label="Email"
            value={auth.userDetails.email}
            disabled
          />
      </Form.Group>
    </>
  );
};

export default Profile;
