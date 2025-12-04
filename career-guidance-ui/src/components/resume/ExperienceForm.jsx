import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { getAISuggestion } from '../../utils/aiHelper';

const ExperienceForm = ({ data, updateData }) => {
  const [experienceList, setExperienceList] = useState(data || []);
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    responsibilities: '',
    industry: '' // Added for AI context
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentExperience({
      ...currentExperience,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    const newExperienceList = [...experienceList, currentExperience];
    setExperienceList(newExperienceList);
    updateData(newExperienceList);
    setCurrentExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: '',
      industry: ''
    });
  };

  const generateResponsibilities = async () => {
    try {
      setIsGenerating(true);
      setAiError(null);

      // Check if required fields are filled
      if (!currentExperience.title || !currentExperience.company) {
        setAiError('Please enter job title and company name for better AI suggestions');
        setIsGenerating(false);
        return;
      }

      // Calculate duration for context
      let duration = '';
      if (currentExperience.startDate && (currentExperience.endDate || currentExperience.current)) {
        duration = `${currentExperience.startDate} to ${currentExperience.current ? 'Present' : currentExperience.endDate}`;
      }

      // Prepare context for AI
      const context = {
        title: currentExperience.title,
        company: currentExperience.company,
        industry: currentExperience.industry || 'Not specified',
        duration: duration,
        responsibilities: currentExperience.responsibilities || 'Not specified'
      };

      // Get AI suggestion
      const suggestion = await getAISuggestion('experience', context);

      // Update form data with the suggestion
      setCurrentExperience({
        ...currentExperience,
        responsibilities: suggestion.trim()
      });

    } catch (error) {
      console.error('Error generating responsibilities:', error);
      setAiError('Failed to generate content. Please try again or write your own.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveExperience = (index) => {
    const newExperienceList = experienceList.filter((_, i) => i !== index);
    setExperienceList(newExperienceList);
    updateData(newExperienceList);
  };

  return (
    <div>
      <h5 className="mb-3">Add Work Experience</h5>
      <Form onSubmit={handleAddExperience}>
        <Form.Group className="mb-3">
          <Form.Label>Job Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={currentExperience.title}
            onChange={handleChange}
            placeholder="e.g., Software Engineer"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            name="company"
            value={currentExperience.company}
            onChange={handleChange}
            placeholder="e.g., Tech Solutions Inc."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Industry (helps with AI suggestions)</Form.Label>
          <Form.Control
            type="text"
            name="industry"
            value={currentExperience.industry}
            onChange={handleChange}
            placeholder="e.g., Software Development, Healthcare, Finance"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={currentExperience.location}
            onChange={handleChange}
            placeholder="e.g., New York, NY"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="text"
            name="startDate"
            value={currentExperience.startDate}
            onChange={handleChange}
            placeholder="e.g., June 2020"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="I currently work here"
            name="current"
            checked={currentExperience.current}
            onChange={handleChange}
          />
        </Form.Group>

        {!currentExperience.current && (
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="text"
              name="endDate"
              value={currentExperience.endDate}
              onChange={handleChange}
              placeholder="e.g., May 2022"
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Responsibilities & Achievements</Form.Label>
          <InputGroup className="mb-2">
            <Form.Control
              as="textarea"
              rows={4}
              name="responsibilities"
              value={currentExperience.responsibilities}
              onChange={handleChange}
              placeholder="Describe your key responsibilities and achievements or use AI to generate ATS-friendly bullet points"
              required
            />
            <Button
              variant="outline-primary"
              onClick={generateResponsibilities}
              disabled={isGenerating || !currentExperience.title || !currentExperience.company}
            >
              {isGenerating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Generating...
                </>
              ) : (
                'AI Assist'
              )}
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            Tip: Use bullet points by starting each line with a dash (-). Click "AI Assist" for ATS-optimized bullet points.
          </Form.Text>
          {aiError && (
            <Alert variant="danger" className="mt-2 p-2 small">
              {aiError}
            </Alert>
          )}
          {!currentExperience.title || !currentExperience.company ? (
            <Alert variant="info" className="mt-2 p-2 small">
              Fill in the job title and company name to enable AI assistance
            </Alert>
          ) : null}
        </Form.Group>

        <Button variant="success" type="submit" className="mb-4">
          Add Experience
        </Button>
      </Form>

      <h5 className="mb-3">Experience List</h5>
      {experienceList.length === 0 ? (
        <p>No work experience entries added yet.</p>
      ) : (
        experienceList.map((exp, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{exp.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {exp.company} {exp.location && `• ${exp.location}`}
              </Card.Subtitle>
              <Card.Text className="text-muted">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Card.Text>
              <Card.Text>
                {exp.responsibilities.split('\n').map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
              </Card.Text>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveExperience(index)}
              >
                Remove
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ExperienceForm;
