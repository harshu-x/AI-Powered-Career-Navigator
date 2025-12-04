import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>

        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={7} className="text-white">
              <div>
                <h1 className="hero-title">Accelerate Your Career Journey</h1>
                <p className="hero-subtitle">
                  Unlock your potential with AI-powered career guidance, resume building,
                  and interview preparation tools designed to help you stand out.
                </p>
                <div className="hero-buttons">
                  <Link to="/resume-builder">
                    <Button variant="primary" size="lg" className="me-3">
                      Build Your Resume
                    </Button>
                  </Link>
                  <Link to="/mock-interviews">
                    <Button variant="outline-light" size="lg" className="me-3">
                      Practice Interviews
                    </Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="success" size="lg">
                      Chat with AI Assistant
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className="hero-image">
                <div className="simple-cube"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Powerful Career Tools</h2>
            <p className="section-subtitle">
              Everything you need to advance your career journey in one place
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    R
                  </div>
                  <Card.Title>Resume Builder</Card.Title>
                  <Card.Text>
                    Create professional resumes with our easy-to-use builder and ATS-optimized templates.
                  </Card.Text>
                  <Link to="/resume-builder">
                    <Button variant="outline-primary" className="mt-3">Try Now</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    I
                  </div>
                  <Card.Title>Interview Prep</Card.Title>
                  <Card.Text>
                    Practice with AI-powered interviews and get instant feedback to improve your skills.
                  </Card.Text>
                  <Link to="/mock-interviews">
                    <Button variant="outline-primary" className="mt-3">Try Now</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    S
                  </div>
                  <Card.Title>Skills Analysis</Card.Title>
                  <Card.Text>
                    Identify your strengths and areas for improvement with our comprehensive skills assessment.
                  </Card.Text>
                  <Link to="/skills-analysis">
                    <Button variant="outline-primary" className="mt-3">Try Now</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    C
                  </div>
                  <Card.Title>Career Chat</Card.Title>
                  <Card.Text>
                    Get personalized career advice and guidance from our AI assistant.
                  </Card.Text>
                  <Link to="/chat">
                    <Button variant="outline-primary" className="mt-3">Try Now</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="cta-card">
                <h2>Ready to Take Your Career to the Next Level?</h2>
                <p>Start with our AI-powered tools today and see the difference in your job search.</p>
                <Link to="/resume-builder">
                  <Button variant="light" size="lg">Get Started Now</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;
