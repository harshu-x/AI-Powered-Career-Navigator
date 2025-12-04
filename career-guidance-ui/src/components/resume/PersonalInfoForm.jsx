import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { getAISuggestion } from '../../utils/aiHelper';

const PersonalInfoForm = ({ data, updateData }) => {
  const [formData, setFormData] = useState(data);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData(formData);
  };

  const generateSummary = async () => {
    try {
      setIsGenerating(true);
      setAiError(null);

      // Check if required fields are filled
      if (!targetRole) {
        setAiError('Please enter a target role for better AI suggestions');
        return;
      }

      // Prepare context for AI
      const context = {
        name: formData.name,
        targetRole: targetRole,
        experienceLevel: experienceLevel,
        skills: [] // We'll add skills later when we have them
      };

      // Get AI suggestion
      const suggestion = await getAISuggestion('summary', context);

      // Update form data with the suggestion
      setFormData({
        ...formData,
        summary: suggestion.trim()
      });

      // Submit the form to save the changes
      updateData({
        ...formData,
        summary: suggestion.trim()
      });

    } catch (error) {
      console.error('Error generating summary:', error);
      setAiError('Failed to generate summary. Please try again or write your own.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>LinkedIn URL</Form.Label>
        <Form.Control
          type="url"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="Enter your LinkedIn profile URL"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>GitHub URL</Form.Label>
        <Form.Control
          type="url"
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="Enter your GitHub profile URL"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Portfolio URL</Form.Label>
        <Form.Control
          type="url"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleChange}
          placeholder="Enter your portfolio website URL"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Target Role/Industry (for AI assistance)</Form.Label>
        <Form.Control
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g., Software Engineer, Data Scientist, Marketing Manager"
          list="job-suggestions"
        />
        <datalist id="job-suggestions">
          <option value="Software Engineer" />
          <option value="Frontend Developer" />
          <option value="Backend Developer" />
          <option value="Full Stack Developer" />
          <option value="Mobile Developer" />
          <option value="DevOps Engineer" />
          <option value="Data Scientist" />
          <option value="Data Analyst" />
          <option value="Data Engineer" />
          <option value="Machine Learning Engineer" />
          <option value="UI Designer" />
          <option value="UX Designer" />
          <option value="Graphic Designer" />
          <option value="Project Manager" />
          <option value="Product Manager" />
          <option value="Digital Marketer" />
          <option value="Content Writer" />
          <option value="Financial Analyst" />
          <option value="Accountant" />
        </datalist>
        <Form.Text className="text-muted">
          Choose from suggestions or type your own for role-specific summary
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Experience Level (for AI assistance)</Form.Label>
        <Form.Select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        >
          <option value="">Select experience level</option>
          <option value="Entry-level">Entry-level (0-2 years)</option>
          <option value="Mid-level">Mid-level (3-5 years)</option>
          <option value="Senior">Senior (6-10 years)</option>
          <option value="Executive">Executive (10+ years)</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Professional Summary</Form.Label>
        <InputGroup className="mb-2">
          <Form.Control
            as="textarea"
            rows={4}
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Write a brief professional summary or use AI to generate one"
          />
          <Button
            variant="outline-primary"
            onClick={generateSummary}
            disabled={isGenerating}
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
          A strong summary improves your ATS score. Click "AI Assist" for an ATS-optimized suggestion.
        </Form.Text>
        {aiError && (
          <Alert variant="danger" className="mt-2 p-2 small">
            {aiError}
          </Alert>
        )}
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Personal Information
      </Button>
    </Form>
  );
};

export default PersonalInfoForm;
