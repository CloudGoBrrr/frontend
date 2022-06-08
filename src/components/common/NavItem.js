import { Link } from "react-router-dom";

import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavItem = (props) => {
  return (
    <Nav.Item>
      <Nav.Link as={Link} to={props.to} href={props.to}>
        <FontAwesomeIcon icon={props.icon} fixedWidth/>
      </Nav.Link>
    </Nav.Item>
  );
};

export default NavItem;
