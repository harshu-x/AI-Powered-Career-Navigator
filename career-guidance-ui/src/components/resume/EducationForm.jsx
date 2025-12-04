import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const EducationForm = ({ data, updateData }) => {
  const [educationList, setEducationList] = useState(data || []);
  const [currentEducation, setCurrentEducation] = useState({
    degree: '',
    institution: '',
    year: '',
    gpa: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEducation({
      ...currentEducation,
      [name]: value
    });
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    const newEducationList = [...educationList, currentEducation];
    setEducationList(newEducationList);
    updateData(newEducationList);
    setCurrentEducation({
      degree: '',
      institution: '',
      year: '',
      gpa: '',
      description: ''
    });
  };

  const handleRemoveEducation = (index) => {
    const newEducationList = educationList.filter((_, i) => i !== index);
    setEducationList(newEducationList);
    updateData(newEducationList);
  };

  return (
    <div>
      <h5 className="mb-3">Add Education</h5>
      <Form onSubmit={handleAddEducation}>
        <Form.Group className="mb-3">
          <Form.Label>Degree/Certificate</Form.Label>
          <Form.Control
            type="text"
            name="degree"
            value={currentEducation.degree}
            onChange={handleChange}
            placeholder="e.g., Bachelor of Science in Computer Science"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Institution</Form.Label>
          <Form.Control
            type="text"
            name="institution"
            value={currentEducation.institution}
            onChange={handleChange}
            placeholder="e.g., University of Technology"
            required
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Year of Passing</Form.Label>
              <Form.Control
                type="text"
                name="year"
                value={currentEducation.year}
                onChange={handleChange}
                placeholder="e.g., 2022"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>CGPA/Percentage</Form.Label>
              <Form.Control
                type="text"
                name="gpa"
                value={currentEducation.gpa}
                onChange={handleChange}
                placeholder="e.g., 3.8/4.0 or 85%"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="description"
            value={currentEducation.description}
            onChange={handleChange}
            placeholder="Additional information about your education"
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mb-4">
          Add Education
        </Button>
      </Form>

      <h5 className="mb-3">Education List</h5>
      {educationList.length === 0 ? (
        <p>No education entries added yet.</p>
      ) : (
        educationList.map((edu, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{edu.degree}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{edu.institution}</Card.Subtitle>
              <Card.Text>
                {edu.year} {edu.gpa && `• GPA: ${edu.gpa}`}
                {edu.description && <div className="mt-2">{edu.description}</div>}
              </Card.Text>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleRemoveEducation(index)}
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

export default EducationForm;
