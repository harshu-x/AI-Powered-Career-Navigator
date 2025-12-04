import React, { useState } from 'react';
import { Form, Button, Badge } from 'react-bootstrap';

const LanguagesForm = ({ data, updateData }) => {
  const [languagesList, setLanguagesList] = useState(data || []);
  const [newLanguage, setNewLanguage] = useState('');

  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (newLanguage.trim() !== '') {
      const newLanguagesList = [...languagesList, newLanguage.trim()];
      setLanguagesList(newLanguagesList);
      updateData(newLanguagesList);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index) => {
    const newLanguagesList = languagesList.filter((_, i) => i !== index);
    setLanguagesList(newLanguagesList);
    updateData(newLanguagesList);
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">Languages</h5>
      <Form onSubmit={handleAddLanguage} className="mb-3">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="e.g., English (Native), Spanish (Fluent)"
          />
          <Button variant="primary" type="submit" className="ms-2">
            Add
          </Button>
        </Form.Group>
      </Form>

      <div>
        {languagesList.length === 0 ? (
          <p>No languages added yet.</p>
        ) : (
          languagesList.map((language, index) => (
            <Badge 
              bg="info" 
              className="me-2 mb-2 p-2" 
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRemoveLanguage(index)}
            >
              {language} ×
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

export default LanguagesForm;
