import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  ToastContainer,
  Toast,
  ProgressBar,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faGear,
  faBars,
  faArrowRightFromBracket,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../components/context/AuthContext";
import { useUpload } from "../components/context/UploadContext";
import { NavItem } from "../components/common";

const Layout = () => {
  const auth = useAuth();
  const location = useLocation();
  const upload = useUpload();

  const [path, setPath] = useState(location.pathname);

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  const handleSignout = () => {
    auth.signout();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/c/files">
            <img
              src="/logo192.png"
              width="60"
              height="60"
              className="d-inline-block"
              alt="Logo"
            />{" "}
            <span className="align-middle">CloudGoBrrr</span>
          </Navbar.Brand>
          <Navbar.Toggle>
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          <Navbar.Collapse>
            <Nav className="me-auto" variant="pills" activeKey={path}>
              <NavItem icon={faFile} to="/c/files" />
              <NavItem icon={faGear} to="/c/settings" />
            </Nav>
            <Nav>
              <NavDropdown align="end" title={auth.userDetails.username}>
                <NavDropdown.Item as={Link} to="/c/settings?tab=profile">
                  <FontAwesomeIcon icon={faPerson} fixedWidth /> Profile
                  settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  className="cloud-dropdown-danger"
                  onClick={handleSignout}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} fixedWidth />{" "}
                  Signout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ToastContainer className="p-3" position="bottom-end">
        <Toast show={upload.uploading} bg="dark">
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Upload</strong>
            <small>
              {upload.uploadProgress}% - {upload.uploadingFile}
            </small>
          </Toast.Header>
          <Toast.Body>
            <ProgressBar animated now={upload.uploadProgress} />
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Outlet />
    </>
  );
};

export default Layout;

// ToDo: Notification Context
// ToDo: Notification System (not in Toasts maybe)
