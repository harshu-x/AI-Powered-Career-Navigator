import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="modern-footer">
      <Container>
        <Row className="py-4">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <div className="footer-brand">
              <span>AI APP</span>
            </div>
            <p className="mt-3 footer-description">
              Empowering your career journey with AI-powered tools for resume building,
              interview preparation, and job recommendations.
            </p>
          </Col>

          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/skills-analysis">Skills Analysis</Link>
              </li>
              <li>
                <Link to="/job-recommendations">Job Recommendations</Link>
              </li>
              <li>
                <Link to="/resume-builder">Resume Builder</Link>
              </li>
              <li>
                <Link to="/mock-interviews">Mock Interviews</Link>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="footer-heading">Contact Us</h5>
            <ul className="footer-contact">
              <li>
                <a href="mailto:harshalpet04@dishaai.com">harshalpet04@dishaai.com</a>
              </li>
              <li>
                <a href="tel:+919322435381">+91 9322435381</a>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} DishaAI. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
