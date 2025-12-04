import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Nav, Tab, Alert, Spinner } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PersonalInfoForm from '../components/resume/PersonalInfoForm';
import EducationForm from '../components/resume/EducationForm';
import ExperienceForm from '../components/resume/ExperienceForm';
import ProjectsForm from '../components/resume/ProjectsForm';
import SkillsForm from '../components/resume/SkillsForm';
import CertificationsForm from '../components/resume/CertificationsForm';
import AchievementsForm from '../components/resume/AchievementsForm';
import LanguagesForm from '../components/resume/LanguagesForm';
import HobbiesForm from '../components/resume/HobbiesForm';
import ResumePreview from '../components/resume/ResumePreview';
import ResumeTemplate1 from '../components/resume/templates/ResumeTemplate1';
import ResumeTemplate2 from '../components/resume/templates/ResumeTemplate2';
import ResumeTemplate3 from '../components/resume/templates/ResumeTemplate3';

const ResumeBuilder = () => {
  // State for resume data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      technical: [],
      soft: []
    },
    certifications: [],
    achievements: [],
    languages: [],
    hobbies: []
  });

  // State for selected template
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [printSuccess, setPrintSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reference for the printable resume
  const resumeRef = useRef();

  // Improved PDF generation method
  const handleDirectDownload = async () => {
    if (!resumeRef.current) return;

    try {
      setPrintSuccess(false);
      setIsGenerating(true);

      // Get the resume element
      const element = resumeRef.current;

      // First attempt: Try using html2canvas with optimal settings
      try {
        // Create a canvas with better settings for PDF conversion
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          foreignObjectRendering: false
        });

        // Get high quality image data
        const imgData = canvas.toDataURL('image/png', 1.0);

        // Calculate dimensions for A4 paper
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF with proper settings
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        // Add the image to the PDF with proper positioning
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Create a clean filename
        const fileName = resumeData.personalInfo.name
          ? resumeData.personalInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_resume.pdf'
          : 'resume.pdf';

        // Save the PDF
        pdf.save(fileName);

        setPrintSuccess(true);
        setTimeout(() => setPrintSuccess(false), 3000);
        return; // Exit if successful
      } catch (canvasError) {
        console.error('First PDF method failed, trying alternative method:', canvasError);
        // Continue to fallback method if this fails
      }

      // Fallback method: Create PDF directly from HTML
      // This uses a different approach that might work better in some browsers
      const html = element.outerHTML;
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume</title>
          <style>
            body { margin: 0; padding: 0; }
            .resume-template {
              width: 8.5in;
              min-height: 11in;
              margin: 0 auto;
              background-color: white;
              color: black;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${html}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
        </html>
      `], { type: 'text/html' });

      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(blob);

      // Open in a new window for printing to PDF
      const printWindow = window.open(blobUrl, '_blank');
      if (!printWindow) {
        alert('Please allow pop-ups to download your resume as PDF');
      } else {
        // Show success message
        setPrintSuccess(true);
        setTimeout(() => setPrintSuccess(false), 3000);
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try the HTML download option and then print it to PDF from your browser.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Update resume data
  const updateResumeData = (section, data) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: data
    }));
  };

  // Render the selected template
  const renderSelectedTemplate = () => {
    switch(selectedTemplate) {
      case 'template1':
        return <ResumeTemplate1 data={resumeData} ref={resumeRef} />;
      case 'template2':
        return <ResumeTemplate2 data={resumeData} ref={resumeRef} />;
      case 'template3':
        return <ResumeTemplate3 data={resumeData} ref={resumeRef} />;
      default:
        return <ResumeTemplate1 data={resumeData} ref={resumeRef} />;
    }
  };

  return (
    <Container fluid className="py-4">
      <h1 className="text-center mb-4">Resume Builder</h1>
      <p className="text-center mb-4">Create a professional resume in minutes. Fill in your details, choose a template, and download your resume.</p>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Resume Information</h4>
            </Card.Header>
            <Card.Body>
              <Tab.Container id="resume-form-tabs" defaultActiveKey="personal">
                {/* FIXED: Using responsive grid layout for tabs */}
                <Nav variant="pills" className="mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Nav.Item style={{ flex: '0 0 auto' }}>
                    <Nav.Link eventKey="personal" style={{ 
                      backgroundColor: '#e9ecef', 
                      color: '#495057',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}>Personal</Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ flex: '0 0 auto' }}>
                    <Nav.Link eventKey="education" style={{ 
                      backgroundColor: '#e9ecef', 
                      color: '#495057',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}>Education</Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ flex: '0 0 auto' }}>
                    <Nav.Link eventKey="experience" style={{ 
                      backgroundColor: '#e9ecef', 
                      color: '#495057',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}>Experience</Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ flex: '0 0 auto' }}>
                    <Nav.Link eventKey="projects" style={{ 
                      backgroundColor: '#e9ecef', 
                      color: '#495057',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}>Projects</Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ flex: '0 0 auto' }}>
                    <Nav.Link eventKey="skills" style={{ 
                      backgroundColor: '#e9ecef', 
                      color: '#495057',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}>Skills</Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ flex: '0 0 auto' }}>
                    <Nav.Link eventKey="other" style={{ 
                      backgroundColor: '#e9ecef', 
                      color: '#495057',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}>Other</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <style>{`
                  .nav-pills .nav-link {
                    background-color: #e9ecef !important;
                    color: #495057 !important;
                    border: 1px solid #dee2e6 !important;
                  }
                  .nav-pills .nav-link:hover {
                    background-color: #dee2e6 !important;
                    color: #212529 !important;
                  }
                  .nav-pills .nav-link.active {
                    background-color: #0d6efd !important;
                    color: white !important;
                    border-color: #0d6efd !important;
                  }
                `}</style>

                <Tab.Content>
                  <Tab.Pane eventKey="personal">
                    <PersonalInfoForm
                      data={resumeData.personalInfo}
                      updateData={(data) => updateResumeData('personalInfo', data)}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="education">
                    <EducationForm
                      data={resumeData.education}
                      updateData={(data) => updateResumeData('education', data)}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="experience">
                    <ExperienceForm
                      data={resumeData.experience}
                      updateData={(data) => updateResumeData('experience', data)}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="projects">
                    <ProjectsForm
                      data={resumeData.projects}
                      updateData={(data) => updateResumeData('projects', data)}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="skills">
                    <SkillsForm
                      data={resumeData.skills}
                      updateData={(data) => updateResumeData('skills', data)}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="other">
                    <CertificationsForm
                      data={resumeData.certifications}
                      updateData={(data) => updateResumeData('certifications', data)}
                    />
                    <AchievementsForm
                      data={resumeData.achievements}
                      updateData={(data) => updateResumeData('achievements', data)}
                    />
                    <LanguagesForm
                      data={resumeData.languages}
                      updateData={(data) => updateResumeData('languages', data)}
                    />
                    <HobbiesForm
                      data={resumeData.hobbies}
                      updateData={(data) => updateResumeData('hobbies', data)}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h4>Choose Template</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    label="Professional Template"
                    name="templateGroup"
                    id="template1"
                    checked={selectedTemplate === 'template1'}
                    onChange={() => setSelectedTemplate('template1')}
                  />
                  <Form.Check
                    type="radio"
                    label="Modern Template"
                    name="templateGroup"
                    id="template2"
                    checked={selectedTemplate === 'template2'}
                    onChange={() => setSelectedTemplate('template2')}
                  />
                  <Form.Check
                    type="radio"
                    label="Creative Template"
                    name="templateGroup"
                    id="template3"
                    checked={selectedTemplate === 'template3'}
                    onChange={() => setSelectedTemplate('template3')}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <div className="mb-4">
            <h5>Download Resume</h5>
            <Button
              variant="success"
              onClick={handleDirectDownload}
              className="w-100 mb-2"
              size="lg"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generating PDF...
                </>
              ) : (
                'Download as PDF'
              )}
            </Button>
            {printSuccess && (
              <Alert variant="success" className="mt-2">
                Resume successfully prepared for download! If the download didn't start automatically,
                check your browser's download settings or try again.
              </Alert>
            )}
          </div>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Live Preview</h4>
            </Card.Header>
            <Card.Body className="p-0">
              <ResumePreview template={selectedTemplate} data={resumeData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'none' }}>
        {renderSelectedTemplate()}
      </div>
    </Container>
  );
};

export default ResumeBuilder;