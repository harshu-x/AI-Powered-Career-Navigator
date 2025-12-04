import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ChatBot from '../components/chatbot/ChatBot';

const ChatBotPage = () => {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Career Guidance Assistant</h1>
          <p className="text-center lead mb-5">
            Ask me anything about career planning, resume building, interview preparation,
            or professional development. I'm here to help you succeed!
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={10} className="mx-auto">
          <ChatBot />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 bg-dark text-white">
            <Card.Body className="text-center">
              <div className="feature-icon mb-3">🎯</div>
              <Card.Title>Career Planning</Card.Title>
              <Card.Text>
                Get personalized advice on career paths, industry trends, and skill development.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 bg-dark text-white">
            <Card.Body className="text-center">
              <div className="feature-icon mb-3">📝</div>
              <Card.Title>Resume Help</Card.Title>
              <Card.Text>
                Ask for tips on improving your resume, cover letter, and professional profiles.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 bg-dark text-white">
            <Card.Body className="text-center">
              <div className="feature-icon mb-3">🎤</div>
              <Card.Title>Interview Prep</Card.Title>
              <Card.Text>
                Practice answering common interview questions and get feedback on your responses.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatBotPage;
