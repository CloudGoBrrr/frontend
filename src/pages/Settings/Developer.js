import { Button, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCodeBranch,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../components/context/AuthContext";
import { useFeatureFlags } from "../../components/context/FeatureFlagContext";

const Developer = () => {
  const auth = useAuth();
  const featureFlags = useFeatureFlags();

  const apiURL =
    window.CLOUDGOBRRR.API_URL === "/api"
      ? window.location.protocol +
        "//" +
        window.location.hostname +
        window.CLOUDGOBRRR.API_URL
      : window.CLOUDGOBRRR.API_URL;

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
      <Card className="mb-3">
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
      <Card>
        <Card.Body>
          <Button as="a" href="https://github.com/CloudGoBrrr" target="_blank">
            <FontAwesomeIcon icon={faCodeBranch} fixedWidth /> Github
          </Button>{" "}
          <Button as="a" href="https://cloudgobrrr.github.io" target="_blank">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} fixedWidth />{" "}
            Website
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default Developer;
