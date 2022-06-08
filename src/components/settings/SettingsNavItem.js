import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SettingsNavItem = (props) => {
  return (
    <Nav.Item>
      <Nav.Link eventKey={props.eventKey} onClick={props.handleClick} className="cursor-pointer">
        <FontAwesomeIcon icon={props.icon} fixedWidth /> {props.title}
      </Nav.Link>
    </Nav.Item>
  );
};

export default SettingsNavItem;
