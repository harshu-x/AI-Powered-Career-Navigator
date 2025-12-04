import React, { useState } from 'react';
import { Form, Button, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getAISuggestion } from '../../utils/aiHelper';

const SkillsForm = ({ data, updateData }) => {
  const [skills, setSkills] = useState(data || { technical: [], soft: [] });
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleAddTechnicalSkill = (e) => {
    e.preventDefault();
    if (newTechnicalSkill.trim() !== '') {
      const updatedSkills = {
        ...skills,
        technical: [...skills.technical, newTechnicalSkill.trim()]
      };
      setSkills(updatedSkills);
      updateData(updatedSkills);
      setNewTechnicalSkill('');
    }
  };

  const handleAddSoftSkill = (e) => {
    e.preventDefault();
    if (newSoftSkill.trim() !== '') {
      const updatedSkills = {
        ...skills,
        soft: [...skills.soft, newSoftSkill.trim()]
      };
      setSkills(updatedSkills);
      updateData(updatedSkills);
      setNewSoftSkill('');
    }
  };

  const handleRemoveTechnicalSkill = (index) => {
    const updatedTechnicalSkills = skills.technical.filter((_, i) => i !== index);
    const updatedSkills = { ...skills, technical: updatedTechnicalSkills };
    setSkills(updatedSkills);
    updateData(updatedSkills);
  };

  const handleRemoveSoftSkill = (index) => {
    const updatedSoftSkills = skills.soft.filter((_, i) => i !== index);
    const updatedSkills = { ...skills, soft: updatedSoftSkills };
    setSkills(updatedSkills);
    updateData(updatedSkills);
  };

  const generateSkillSuggestions = async () => {
    try {
      setIsGenerating(true);
      setAiError(null);

      // Check if required fields are filled
      if (!targetRole) {
        setAiError('Please enter a target role for better AI suggestions');
        setIsGenerating(false);
        return;
      }

      // Prepare context for AI
      const context = {
        targetRole: targetRole,
        experienceLevel: experienceLevel || 'Mid-level',
        currentSkills: [...skills.technical, ...skills.soft]
      };

      // Get AI suggestion
      const suggestion = await getAISuggestion('skills', context);

      // Parse the suggestion to separate technical and soft skills
      const technicalSkillsMatch = suggestion.match(/Technical Skills:([\s\S]*?)(?=Soft Skills:|$)/i);
      const softSkillsMatch = suggestion.match(/Soft Skills:([\s\S]*?)$/i);

      let technicalSkills = [];
      let softSkills = [];

      if (technicalSkillsMatch && technicalSkillsMatch[1]) {
        technicalSkills = technicalSkillsMatch[1]
          .split('\n')
          .map(line => line.trim().replace(/^-\s*/, ''))
          .filter(skill => skill.length > 0);
      }

      if (softSkillsMatch && softSkillsMatch[1]) {
        softSkills = softSkillsMatch[1]
          .split('\n')
          .map(line => line.trim().replace(/^-\s*/, ''))
          .filter(skill => skill.length > 0);
      }

      // If parsing failed, try to extract skills in a different way
      if (technicalSkills.length === 0 && softSkills.length === 0) {
        // Just extract any words that look like skills
        const allSkills = suggestion
          .split(/[,.\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 2 && s.length < 30)
          .filter(s => !s.toLowerCase().includes('skill'));

        // Assume first half are technical, second half are soft
        const midpoint = Math.floor(allSkills.length / 2);
        technicalSkills = allSkills.slice(0, midpoint);
        softSkills = allSkills.slice(midpoint);
      }

      // Update skills with AI suggestions
      const updatedSkills = {
        technical: [...new Set([...skills.technical, ...technicalSkills])],
        soft: [...new Set([...skills.soft, ...softSkills])]
      };

      setSkills(updatedSkills);
      updateData(updatedSkills);

    } catch (error) {
      console.error('Error generating skills:', error);
      setAiError('Failed to generate skills. Please try again or add your own skills.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h5>AI Skills Suggestion</h5>
        <p className="text-muted small">
          Get ATS-optimized skill suggestions based on your target role
        </p>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Target Role/Industry</Form.Label>
              <Form.Control
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Software Engineer, Data Scientist"
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
                Choose from suggestions or type your own for job-specific skills
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Experience Level</Form.Label>
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
          </Col>
        </Row>

        <Button
          variant="outline-primary"
          onClick={generateSkillSuggestions}
          disabled={isGenerating || !targetRole}
          className="mb-3"
        >
          {isGenerating ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />
              Generating ATS-Optimized Skills...
            </>
          ) : (
            'Get AI Skill Suggestions'
          )}
        </Button>

        {aiError && (
          <Alert variant="danger" className="mb-3 p-2 small">
            {aiError}
          </Alert>
        )}

        {!targetRole && (
          <Alert variant="info" className="mb-3 p-2 small">
            Enter a target role to enable AI skill suggestions
          </Alert>
        )}

        {targetRole && !isGenerating && !aiError && (
          <Alert variant="info" className="mb-3 p-2 small">
            <strong>Job-specific skills available!</strong> Click "Get AI Skill Suggestions" to see recommended skills for "{targetRole}".
            These skills are tailored to improve your ATS score for this specific role.
          </Alert>
        )}
      </div>

      <Row>
        <Col md={6}>
          <h5 className="mb-3">Technical Skills</h5>
          <Form onSubmit={handleAddTechnicalSkill} className="mb-3">
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                value={newTechnicalSkill}
                onChange={(e) => setNewTechnicalSkill(e.target.value)}
                placeholder="e.g., JavaScript, Python, AWS"
              />
              <Button variant="primary" type="submit" className="ms-2">
                Add
              </Button>
            </Form.Group>
          </Form>

          <div className="mb-4">
            {skills.technical.length === 0 ? (
              <p>No technical skills added yet.</p>
            ) : (
              skills.technical.map((skill, index) => (
                <Badge
                  bg="primary"
                  className="me-2 mb-2 p-2"
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveTechnicalSkill(index)}
                >
                  {skill} ×
                </Badge>
              ))
            )}
          </div>
        </Col>

        <Col md={6}>
          <h5 className="mb-3">Soft Skills</h5>
          <Form onSubmit={handleAddSoftSkill} className="mb-3">
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                value={newSoftSkill}
                onChange={(e) => setNewSoftSkill(e.target.value)}
                placeholder="e.g., Communication, Leadership"
              />
              <Button variant="success" type="submit" className="ms-2">
                Add
              </Button>
            </Form.Group>
          </Form>

          <div className="mb-4">
            {skills.soft.length === 0 ? (
              <p>No soft skills added yet.</p>
            ) : (
              skills.soft.map((skill, index) => (
                <Badge
                  bg="success"
                  className="me-2 mb-2 p-2"
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveSoftSkill(index)}
                >
                  {skill} ×
                </Badge>
              ))
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SkillsForm;
