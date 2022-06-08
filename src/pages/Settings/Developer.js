import { Card, Form } from "react-bootstrap";

import { useFeatureFlags } from "../../components/context/FeatureFlagContext";

const Developer = () => {
  const featureFlags = useFeatureFlags();

  const apiURL =
    process.env.REACT_APP_API_URL === "/api"
      ? window.location.protocol +
        "//" +
        window.location.hostname +
        process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL;

  return (
    <>
      <Card>
        <Card.Header>API</Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>API URL</Form.Label>
            <Form.Control type="text" value={apiURL} disabled />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>API Version</Form.Label>
            <Form.Control type="text" value={featureFlags.version} disabled />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
};

export default Developer;
