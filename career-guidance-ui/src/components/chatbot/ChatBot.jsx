import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import './ChatBot.css';

// Format assistant messages
const formatMessage = (text) => {
  if (!text) return '';

  let formattedText = text
    .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
    .replace(/^# (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h4>$1</h4>')
    .replace(/^### (.*?)$/gm, '<h5>$1</h5>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/^\* (.*?)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
    .replace(/^([A-Za-z]+):/gm, '<strong>$1:</strong>')
    .replace(/\n/g, '<br />');

  if (formattedText.includes('<li>')) {
    formattedText = formattedText
      .replace(/(<li>.*?<\/li>)(?:<br \/>)+/g, '$1')
      .replace(/(?:<br \/>)+(<li>)/g, '$1')
      .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/<\/ul><br \/><ul>/g, '');
  }

  return formattedText;
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `# Welcome to Career Guidance Assistant!

I'm here to help you with:

- **Career Planning**
- **Resume Building**
- **Interview Preparation**
- **Job Search Strategies**
- **Skill Development**

How can I assist you today?`
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // ✅ SEND MESSAGE TO YOUR GEMINI BACKEND (NOT DIRECT API)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
     const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://ai-powered-career-navigator-2.onrender.com';

const response = await fetch(`${API_BASE}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: input })
});

      const data = await response.json();

      if (data?.reply) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply
        }]);
      } else {
        throw new Error('Invalid server response');
      }

    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Server error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="chat-container">
      <Card.Header className="chat-header">
        <h5 className="mb-0">Career Guidance Assistant</h5>
        <small className="text-muted">Powered by Gemini AI</small>
      </Card.Header>

      <Card.Body className="chat-body">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div
                className="message-content"
                dangerouslySetInnerHTML={{
                  __html:
                    message.role === 'assistant'
                      ? formatMessage(message.content)
                      : message.content
                }}
              />
            </div>
          ))}

          {isLoading && (
            <div className="message assistant-message">
              <div className="message-content">
                <Spinner animation="border" size="sm" className="me-2" />
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </Card.Body>

      <Card.Footer className="chat-footer">
        <Form onSubmit={handleSendMessage}>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Ask me about your career..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              className="ms-2"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Spinner animation="border" size="sm" /> : 'Send'}
            </Button>
          </div>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default ChatBot;
