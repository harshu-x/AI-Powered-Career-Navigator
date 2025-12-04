import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { getAISuggestion } from '../../utils/aiHelper';

const ProjectsForm = ({ data, updateData }) => {
  const [projectsList, setProjectsList] = useState(data || []);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    role: '' // Added for AI context
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({
      ...currentProject,
      [name]: value
    });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const newProjectsList = [...projectsList, currentProject];
    setProjectsList(newProjectsList);
    updateData(newProjectsList);
    setCurrentProject({
      title: '',
      description: '',
      technologies: '',
      link: '',
      role: ''
    });
  };

  const generateProjectDescription = async () => {
    try {
      setIsGenerating(true);
      setAiError(null);

      // Check if required fields are filled
      if (!currentProject.title || !currentProject.technologies) {
        setAiError('Please enter project title and technologies for better AI suggestions');
        setIsGenerating(false);
        return;
      }

      // Prepare context for AI
      const context = {
        title: currentProject.title,
        technologies: currentProject.technologies,
        type: currentProject.title.toLowerCase().includes('mobile') ? 'Mobile App' :
              currentProject.title.toLowerCase().includes('web') ? 'Web Application' :
              'Software Project',
        role: currentProject.role || 'Developer'
      };

      // Get AI suggestion
      const suggestion = await getAISuggestion('project', context);

      // Update form data with the suggestion
      setCurrentProject({
        ...currentProject,
        description: suggestion.trim()
      });

    } catch (error) {
      console.error('Error generating project description:', error);
      setAiError('Failed to generate content. Please try again or write your own.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveProject = (index) => {
    const newProjectsList = projectsList.filter((_, i) => i !== index);
    setProjectsList(newProjectsList);
    updateData(newProjectsList);
  };

  return (
    <div>
      <h5 className="mb-3">Add Project</h5>
      <Form onSubmit={handleAddProject}>
        <Form.Group className="mb-3">
          <Form.Label>Project Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={currentProject.title}
            onChange={handleChange}
            placeholder="e.g., E-commerce Website"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Your Role in the Project</Form.Label>
          <Form.Control
            type="text"
            name="role"
            value={currentProject.role}
            onChange={handleChange}
            placeholder="e.g., Lead Developer, Frontend Engineer, Project Manager"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <InputGroup className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={currentProject.description}
              onChange={handleChange}
              placeholder="Describe your project, its purpose, and your role or use AI to generate an ATS-friendly description"
              required
            />
            <Button
              variant="outline-primary"
              onClick={generateProjectDescription}
              disabled={isGenerating || !currentProject.title || !currentProject.technologies}
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
            A compelling project description improves your ATS score. Click "AI Assist" for an optimized description.
          </Form.Text>
          {aiError && (
            <Alert variant="danger" className="mt-2 p-2 small">
              {aiError}
            </Alert>
          )}
          {(!currentProject.title || !currentProject.technologies) && (
            <Alert variant="info" className="mt-2 p-2 small">
              Fill in the project title and technologies to enable AI assistance
            </Alert>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Technologies Used</Form.Label>
          <Form.Control
            type="text"
            name="technologies"
            value={currentProject.technologies}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Project Link (Optional)</Form.Label>
          <Form.Control
            type="url"
            name="link"
            value={currentProject.link}
            onChange={handleChange}
            placeholder="e.g., https://github.com/yourusername/project"
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mb-4">
          Add Project
        </Button>
      </Form>

      <h5 className="mb-3">Projects List</h5>
      {projectsList.length === 0 ? (
        <p>No projects added yet.</p>
      ) : (
        projectsList.map((project, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{project.title}</Card.Title>
              <Card.Text>{project.description}</Card.Text>
              <Card.Text>
                <strong>Technologies:</strong> {project.technologies}
              </Card.Text>
              {project.link && (
                <Card.Link href={project.link} target="_blank" rel="noopener noreferrer">
                  Project Link
                </Card.Link>
              )}
              <div className="mt-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveProject(index)}
                >
                  Remove
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ProjectsForm;
