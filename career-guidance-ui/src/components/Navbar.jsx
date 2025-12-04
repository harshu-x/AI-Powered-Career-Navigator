import React from "react";
import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import '../styles/Navbar.css';

const Navbar = () => {

  return (
    <BootstrapNavbar
      expand="lg"
      className="modern-navbar"
      bg="dark"
      variant="dark"
    >
      <Container>
        {/* Logo */}
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-brand">
          <span>AI APP</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/skills-analysis" className="nav-link">
              Skills
            </Nav.Link>

            <Nav.Link as={Link} to="/resume-builder" className="nav-link">
              Resume
            </Nav.Link>

            <Nav.Link as={Link} to="/mock-interviews" className="nav-link">
              Interviews
            </Nav.Link>

            <Nav.Link as={Link} to="/chat" className="nav-link">
              Chat Assistant
            </Nav.Link>
          </Nav>

          <div className="d-flex ms-lg-3">
            <Button
              as={Link}
              to="/resume-builder"
              variant="primary"
              className="action-button"
            >
              Get Started
            </Button>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
