import React from 'react';
import { Card } from 'react-bootstrap';
import ResumeTemplate1 from './templates/ResumeTemplate1';
import ResumeTemplate2 from './templates/ResumeTemplate2';
import ResumeTemplate3 from './templates/ResumeTemplate3';

const ResumePreview = ({ template, data }) => {
  const renderTemplate = () => {
    switch(template) {
      case 'template1':
        return <ResumeTemplate1 data={data} />;
      case 'template2':
        return <ResumeTemplate2 data={data} />;
      case 'template3':
        return <ResumeTemplate3 data={data} />;
      default:
        return <ResumeTemplate1 data={data} />;
    }
  };

  return (
    <div className="resume-preview">
      <Card className="border-0">
        <Card.Body className="p-0">
          <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
            {renderTemplate()}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResumePreview;
