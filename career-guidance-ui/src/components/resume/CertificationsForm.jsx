import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const CertificationsForm = ({ data, updateData }) => {
  const [certificationsList, setCertificationsList] = useState(data || []);
  const [currentCertification, setCurrentCertification] = useState({
    name: '',
    issuer: '',
    year: '',
    link: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCertification({
      ...currentCertification,
      [name]: value
    });
  };

  const handleAddCertification = (e) => {
    e.preventDefault();
    const newCertificationsList = [...certificationsList, currentCertification];
    setCertificationsList(newCertificationsList);
    updateData(newCertificationsList);
    setCurrentCertification({
      name: '',
      issuer: '',
      year: '',
      link: ''
    });
  };

  const handleRemoveCertification = (index) => {
    const newCertificationsList = certificationsList.filter((_, i) => i !== index);
    setCertificationsList(newCertificationsList);
    updateData(newCertificationsList);
  };

  return (
    <div>
      <h5 className="mb-3">Add Certification</h5>
      <Form onSubmit={handleAddCertification}>
        <Form.Group className="mb-3">
          <Form.Label>Certification Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={currentCertification.name}
            onChange={handleChange}
            placeholder="e.g., AWS Certified Solutions Architect"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Issuing Organization</Form.Label>
          <Form.Control
            type="text"
            name="issuer"
            value={currentCertification.issuer}
            onChange={handleChange}
            placeholder="e.g., Amazon Web Services"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="text"
            name="year"
            value={currentCertification.year}
            onChange={handleChange}
            placeholder="e.g., 2022"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Certificate Link (Optional)</Form.Label>
          <Form.Control
            type="url"
            name="link"
            value={currentCertification.link}
            onChange={handleChange}
            placeholder="e.g., https://www.credential.net/..."
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mb-4">
          Add Certification
        </Button>
      </Form>

      <h5 className="mb-3">Certifications List</h5>
      {certificationsList.length === 0 ? (
        <p>No certifications added yet.</p>
      ) : (
        certificationsList.map((cert, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{cert.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {cert.issuer} {cert.year && `• ${cert.year}`}
              </Card.Subtitle>
              {cert.link && (
                <Card.Link href={cert.link} target="_blank" rel="noopener noreferrer">
                  View Certificate
                </Card.Link>
              )}
              <div className="mt-2">
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleRemoveCertification(index)}
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

export default CertificationsForm;
