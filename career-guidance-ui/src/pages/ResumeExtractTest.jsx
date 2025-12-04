import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./SkillsAnalysis.css";

// API URL - change this to your Flask backend URL
const API_URL = "http://localhost:5000";

const ResumeExtractTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [extractionResult, setExtractionResult] = useState(null);

  // Handle file upload and extraction
  const handleExtract = async (e) => {
    e.preventDefault();
    
    // Get the file from the input
    const fileInput = document.getElementById('resume-upload');
    const file = fileInput.files[0];
    
    // Validate inputs
    if (!file) {
      setErrorMessage("Please upload your resume");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    setExtractionResult(null);
    
    try {
      // Create form data to send to the API
      const formData = new FormData();
      formData.append('resume', file);
      
      // Call the backend API
      const response = await fetch(`${API_URL}/api/extract-resume-text`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from resume');
      }
      
      const data = await response.json();
      setExtractionResult(data);
      
    } catch (error) {
      console.error("Error extracting text:", error);
      setErrorMessage(`Failed to extract text: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Resume Text Extraction Test</h1>
          <p className="text-center">
            Upload your resume to test the text extraction functionality
          </p>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="bg-dark text-white">
            <Card.Body>
              <h3 className="mb-4">Upload Your Resume</h3>
              
              <Form onSubmit={handleExtract}>
                {/* Resume Upload */}
                <Form.Group className="mb-4">
                  <Form.Label>Upload Resume</Form.Label>
                  <Form.Control
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.docx,.txt"
                  />
                  <Form.Text className="text-muted">
                    Supported formats: PDF, DOCX, and TXT files
                  </Form.Text>
                </Form.Group>
                
                {/* Error Message */}
                {errorMessage && (
                  <div className="alert alert-danger mb-4">
                    {errorMessage}
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading}
                    className="mb-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Extracting Text...
                      </>
                    ) : 'Extract Text'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          {/* Results Section */}
          {extractionResult && (
            <Card className="bg-dark text-white mt-4">
              <Card.Body>
                <h3 className="mb-4">Extraction Results</h3>
                
                <div className="mb-3">
                  <strong>File:</strong> {extractionResult.filename}
                </div>
                
                <div className="mb-3">
                  <strong>File Type:</strong> {extractionResult.fileType}
                </div>
                
                <div className="mb-3">
                  <strong>File Size:</strong> {Math.round(extractionResult.fileSize / 1024)} KB
                </div>
                
                <div className="mb-3">
                  <strong>Extracted Text Length:</strong> {extractionResult.textLength} characters
                </div>
                
                <div className="analysis-result">
                  <h4>Extracted Text:</h4>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', maxHeight: '400px', overflow: 'auto' }}>
                    {extractionResult.extractedText}
                  </pre>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeExtractTest;
