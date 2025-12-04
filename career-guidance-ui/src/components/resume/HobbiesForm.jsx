import React, { useState } from 'react';
import { Form, Button, Badge } from 'react-bootstrap';

const HobbiesForm = ({ data, updateData }) => {
  const [hobbiesList, setHobbiesList] = useState(data || []);
  const [newHobby, setNewHobby] = useState('');

  const handleAddHobby = (e) => {
    e.preventDefault();
    if (newHobby.trim() !== '') {
      const newHobbiesList = [...hobbiesList, newHobby.trim()];
      setHobbiesList(newHobbiesList);
      updateData(newHobbiesList);
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (index) => {
    const newHobbiesList = hobbiesList.filter((_, i) => i !== index);
    setHobbiesList(newHobbiesList);
    updateData(newHobbiesList);
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">Hobbies & Interests</h5>
      <Form onSubmit={handleAddHobby} className="mb-3">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            placeholder="e.g., Photography, Chess, Hiking"
          />
          <Button variant="primary" type="submit" className="ms-2">
            Add
          </Button>
        </Form.Group>
      </Form>

      <div>
        {hobbiesList.length === 0 ? (
          <p>No hobbies added yet.</p>
        ) : (
          hobbiesList.map((hobby, index) => (
            <Badge 
              bg="secondary" 
              className="me-2 mb-2 p-2" 
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRemoveHobby(index)}
            >
              {hobby} ×
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

export default HobbiesForm;
