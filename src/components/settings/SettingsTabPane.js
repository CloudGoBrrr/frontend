import { Card, Tab } from "react-bootstrap";

const SettingsTabPane = (props) => {
  return (
    <Tab.Pane eventKey={props.eventKey}>
      <Card.Header>{props.title}</Card.Header>
      <Card.Body>{props.children}</Card.Body>
    </Tab.Pane>
  );
};

export default SettingsTabPane;
