import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

const AchievementsForm = ({ data, updateData }) => {
  const [achievementsList, setAchievementsList] = useState(data || []);
  const [newAchievement, setNewAchievement] = useState('');

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (newAchievement.trim() !== '') {
      const newAchievementsList = [...achievementsList, newAchievement.trim()];
      setAchievementsList(newAchievementsList);
      updateData(newAchievementsList);
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index) => {
    const newAchievementsList = achievementsList.filter((_, i) => i !== index);
    setAchievementsList(newAchievementsList);
    updateData(newAchievementsList);
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">Achievements & Awards</h5>
      <Form onSubmit={handleAddAchievement} className="mb-3">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            placeholder="e.g., First place in coding competition"
          />
          <Button variant="primary" type="submit" className="ms-2">
            Add
          </Button>
        </Form.Group>
      </Form>

      {achievementsList.length === 0 ? (
        <p>No achievements added yet.</p>
      ) : (
        <ListGroup>
          {achievementsList.map((achievement, index) => (
            <ListGroup.Item 
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              {achievement}
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleRemoveAchievement(index)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default AchievementsForm;
