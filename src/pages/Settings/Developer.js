import { Card, Form } from "react-bootstrap";

import { useAuth } from "../../components/context/AuthContext";
import { useFeatureFlags } from "../../components/context/FeatureFlagContext";

const Developer = () => {
  const auth = useAuth();
  const featureFlags = useFeatureFlags();

  const apiURL =
    process.env.REACT_APP_API_URL === "/api"
      ? window.location.protocol +
        "//" +
        window.location.hostname +
        process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL;

  const webDavURL = apiURL + "/webdav/" + auth.userDetails.username;

  return (
    <>
      <Card className="mb-3">
        <Card.Header>WebDAV</Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>URL</Form.Label>
            <Form.Control type="text" value={webDavURL} disabled />
          </Form.Group>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>API</Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>URL</Form.Label>
            <Form.Control type="text" value={apiURL} disabled />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Version</Form.Label>
            <Form.Control type="text" value={featureFlags.version} disabled />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
};

export default Developer;
