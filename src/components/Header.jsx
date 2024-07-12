import React from 'react';
import { Navbar, Nav, Container, Row, Col, Button } from 'react-bootstrap';
import "./Header.css"

const Header = ({ name, onLogout, onShowBookings }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Row className="w-100">
          <Col className="d-flex align-items-center">
            <Navbar.Brand href="#">
              <img
                src="https://www.orbisvacation.us/img/img_orbis_logo.webp"
                width="140" 
                height="50"
                className="d-inline-block align-top"
                alt="Logo"
              />
            </Navbar.Brand>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <Nav>
              <Nav.Item className="d-flex align-items-center nav-link">
                Hello, {name}
              </Nav.Item>
              <Nav.Item className="d-flex align-items-center">
                <Button variant="outline-primary" className="ml-2" onClick={onShowBookings}>Show Bookings</Button>
              </Nav.Item>
              <Nav.Item className="d-flex align-items-center">
                <Button variant="outline-danger" className="ml-2" onClick={onLogout}>Logout</Button>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
