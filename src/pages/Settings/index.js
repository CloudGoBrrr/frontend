import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Card, Tab, Row, Col, Nav } from "react-bootstrap";
import {
  faGears,
  faLock,
  faCode,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

import General from "./General";
import Profile from "./Profile";
import Security from "./Security";
import Developer from "./Developer";
import { SettingsNavItem, SettingsTabPane } from "../../components/settings";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "general");

  useEffect(() => {
    setActiveTab(searchParams.get("tab") || "general");
  }, [searchParams]);

  const handleClick = (e) => {
    setSearchParams({tab: e.target.dataset.rrUiEventKey});
  }

  return (
    <Tab.Container
      activeKey={activeTab}
      mountOnEnter={true}
      unmountOnExit={true}
    >
      <Row className="cloud-settings">
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <SettingsNavItem eventKey="general" icon={faGears} title="General" handleClick={handleClick} />
            <SettingsNavItem eventKey="profile" icon={faPerson} title="Profile" handleClick={handleClick} />
            <SettingsNavItem eventKey="security" icon={faLock} title="Security" handleClick={handleClick} />
            <SettingsNavItem eventKey="developer" icon={faCode} title="Developer" handleClick={handleClick} />
          </Nav>
        </Col>
        <Col sm={9}>
          <Card>
            <Tab.Content>
              <SettingsTabPane eventKey="general" title="General"><General /></SettingsTabPane>
              <SettingsTabPane eventKey="profile" title="Profile"><Profile /></SettingsTabPane>
              <SettingsTabPane eventKey="security" title="Security"><Security /></SettingsTabPane>
              <SettingsTabPane eventKey="developer" title="Developer"><Developer /></SettingsTabPane>
            </Tab.Content>
          </Card>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default Settings;
