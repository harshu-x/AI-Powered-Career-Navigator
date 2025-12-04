import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./SkillsAnalysis.css";

// API URL - change this to your Flask backend URL
const API_URL = "http://localhost:5000";

// Common job titles
const commonJobs = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "Marketing Manager",
  "Financial Analyst",
  "Project Manager",
  "Business Analyst",
  "Sales Representative",
  "Customer Success Manager"
];

// Sample resume text for demonstration
const sampleResumeText = `JOHN DOE
123 Main Street, City, State 12345 | (123) 456-7890 | john.doe@email.com | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable, high-performance applications and leading development teams to success.

SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Redux, HTML5, CSS3, SASS
• Backend: Node.js, Express, Django, Spring Boot
• Databases: MongoDB, PostgreSQL, MySQL
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
• Tools: Git, JIRA, Confluence, Postman

WORK EXPERIENCE
Senior Software Engineer | Tech Solutions Inc. | Jan 2020 - Present
• Led development of a customer-facing portal that increased user engagement by 35%
• Architected and implemented microservices architecture, improving system scalability
• Mentored junior developers and conducted code reviews to ensure quality standards
• Collaborated with product and design teams to deliver features aligned with business goals

Software Engineer | Digital Innovations LLC | Mar 2018 - Dec 2019
• Developed RESTful APIs using Node.js and Express, serving over 10,000 daily users
• Implemented responsive UI components with React, improving mobile user experience
• Optimized database queries, reducing load times by 40%
• Participated in agile development processes, including daily stand-ups and sprint planning

Junior Developer | WebTech Solutions | Jun 2016 - Feb 2018
• Built and maintained web applications using JavaScript, HTML, and CSS
• Assisted in database design and implementation using MongoDB
• Collaborated with QA team to identify and fix bugs
• Participated in code reviews and documentation

EDUCATION
Bachelor of Science in Computer Science | State University | 2016
• GPA: 3.8/4.0
• Relevant coursework: Data Structures, Algorithms, Database Systems, Web Development

PROJECTS
E-commerce Platform (2019)
• Built a full-stack e-commerce application using MERN stack
• Implemented secure payment processing and user authentication
• Deployed on AWS with CI/CD pipeline

Task Management System (2018)
• Developed a collaborative task management tool with real-time updates
• Utilized WebSockets for instant notifications
• Implemented drag-and-drop functionality for intuitive user experience

CERTIFICATIONS
• AWS Certified Developer - Associate (2021)
• MongoDB Certified Developer (2020)
• React Developer Certification (2019)`;

const DirectResumeInput = () => {
  const [resumeText, setResumeText] = useState(sampleResumeText);
  const [targetJob, setTargetJob] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [data, setData] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!resumeText.trim()) {
      setErrorMessage("Please enter your resume text");
      return;
    }

    if (!targetJob) {
      setErrorMessage("Please select a target job");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setAnalysisResult("");

    try {
      // Call the backend API
      const response = await fetch(`${API_URL}/api/analyze-resume-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeText,
          jobTitle: targetJob
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const data = await response.json();

      // Store the raw data
      setData(data);

      // Format the analysis result
      const formattedResult = formatAnalysisResult(data, targetJob);
      setAnalysisResult(formattedResult);

    } catch (error) {
      console.error("Error analyzing resume:", error);
      setErrorMessage(`Failed to analyze resume: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Format the analysis result from the API
  const formatAnalysisResult = (data, jobTitle) => {
    if (data.error) {
      return `Error: ${data.error}${data.message ? `\n\nDetails: ${data.message}` : ''}`;
    }

    // Check if we have the structured format
    if (data.resumeOverview) {
      let result = formatStructuredAnalysis(data, jobTitle);

      // Add extracted text section for verification
      if (data.extractedText) {
        result += `\n\n## Verified Resume Text
\`\`\`
${data.extractedText}
\`\`\``;
      }

      return result;
    }

    // Fallback to the old format
    return `# Resume Analysis for ${jobTitle} Position

## Skills Gap Analysis
${data.missingSkills?.map(skill => `- ${skill}`).join('\n') || '- No specific skills gap identified'}

## Resume Improvement Suggestions
${data.resumeImprovements?.map(item => `- ${item}`).join('\n') || '- No specific improvements suggested'}

## Skill Development Recommendations
${data.skillDevelopment?.map(item => `- ${item}`).join('\n') || '- No specific skill development recommendations'}

## ATS Optimization Tips
${data.atsOptimization?.map(item => `- ${item}`).join('\n') || '- No specific ATS optimization tips'}

${data.summary ? `\n## Summary\n${data.summary}` : ''}

${data.extractedText ? `\n## Verified Resume Text\n\`\`\`\n${data.extractedText}\n\`\`\`` : ''}`;
  };

  // Format the structured analysis result
  const formatStructuredAnalysis = (data, jobTitle) => {
    const { resumeOverview, skillsAnalysis, improvementSuggestions, skillDevelopment, atsOptimization } = data;

    // Format Resume Overview section
    const overviewSection = `# Resume Analysis for ${jobTitle} Position

## Resume Overview
${resumeOverview.summary || ''}

**Strong Sections:**
${resumeOverview.strongSections?.map(section => `- ${section}`).join('\n') || '- None identified'}

**Weak Sections:**
${resumeOverview.weakSections?.map(section => `- ${section}`).join('\n') || '- None identified'}

**Missing Sections:**
${resumeOverview.missingSections?.map(section => `- ${section}`).join('\n') || '- None identified'}`;

    // Format Skills Analysis section
    const skillsSection = `## Skills Analysis

**Skills Present in Your Resume:**
${skillsAnalysis?.presentSkills?.map(skill => `- ${skill}`).join('\n') || '- None identified'}

**Missing Skills for ${jobTitle} Role:**
${skillsAnalysis?.missingSkills?.map(item => `- **${item.skill}**: ${item.importance}`).join('\n') || '- None identified'}`;

    // Format Improvement Suggestions section
    const improvementSection = `## Resume Improvement Suggestions
${improvementSuggestions?.map(item =>
  `### ${item.section}

**Original Content:**
> ${item.originalContent}

**Suggested Revision:**
${item.suggestedRevision}

**Why This Helps:**
${item.explanation}
`).join('\n\n') || '- No specific improvements suggested'}`;

    // Format Skill Development section
    const developmentSection = `## Skill Development Recommendations
${skillDevelopment?.map(item =>
  `### ${item.skill}

**Recommended Resources:**
${item.resources?.map(resource => `- ${resource}`).join('\n') || '- None provided'}

**Project Ideas:**
${item.projectIdeas?.map(project => `- ${project}`).join('\n') || '- None provided'}
`).join('\n\n') || '- No specific skill development recommendations'}`;

    // Format ATS Optimization section
    const atsSection = `## ATS Optimization Tips

**Missing Keywords:**
${atsOptimization?.missingKeywords?.map(keyword => `- ${keyword}`).join('\n') || '- None identified'}

**Formatting Tips:**
${atsOptimization?.formattingTips?.map(tip => `- ${tip}`).join('\n') || '- None provided'}

${atsOptimization?.sectionTemplates && Object.keys(atsOptimization.sectionTemplates).length > 0 ?
  `**Section Templates:**\n\n${Object.entries(atsOptimization.sectionTemplates).map(([section, template]) =>
    `### ${section} Template:\n\`\`\`\n${template}\n\`\`\``
  ).join('\n\n')}` : ''}`;

    // Combine all sections
    return [overviewSection, skillsSection, improvementSection, developmentSection, atsSection].join('\n\n');
  };

  // Reset the form
  const handleReset = () => {
    setResumeText(sampleResumeText);
    setTargetJob("");
    setErrorMessage("");
    setAnalysisResult("");
    setData(null);
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Direct Resume Analysis</h1>
          <p className="text-center">
            Enter your resume text directly and get AI-powered feedback
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="bg-dark text-white">
            <Card.Body>
              <h3 className="mb-4">Enter Your Resume</h3>

              <Form onSubmit={handleSubmit}>
                {/* Resume Text Input */}
                <Form.Group className="mb-4">
                  <Form.Label>Resume Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={15}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    required
                    className="resume-textarea"
                  />
                  <Form.Text className="text-muted">
                    Paste your resume text here or edit the sample resume
                  </Form.Text>
                </Form.Group>

                {/* Target Job Selection */}
                <Form.Group className="mb-4">
                  <Form.Label>Target Job Title</Form.Label>
                  <Form.Select
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    required
                  >
                    <option value="">Select a job title</option>
                    {commonJobs.map((job, index) => (
                      <option key={index} value={job}>{job}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Error Message */}
                {errorMessage && (
                  <div className="alert alert-danger mb-4">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="mb-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Analyzing Resume...
                      </>
                    ) : 'Analyze My Resume'}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          {/* Loading State */}
          {isLoading && (
            <Card className="bg-dark text-white">
              <Card.Body className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="mt-3">Analyzing Your Resume</h4>
                <p className="text-muted">This may take a moment...</p>
                <div className="progress mt-3">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: '75%' }}
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Results Section */}
          {!isLoading && analysisResult && (
            <div className="analysis-results-container">
              <h3 className="text-center mb-4">Analysis Results</h3>

              {/* Resume Overview Card */}
              <Card className="analysis-card mb-4">
                <Card.Header className="bg-primary text-white">
                  <h4 className="m-0">Resume Overview</h4>
                </Card.Header>
                <Card.Body>
                  <div className="overview-content">
                    {data?.resumeOverview?.summary && (
                      <p className="summary-text">{data.resumeOverview.summary}</p>
                    )}

                    <div className="sections-grid">
                      <div className="section-box strong-sections">
                        <h5>Strong Sections</h5>
                        <ul>
                          {data?.resumeOverview?.strongSections?.length > 0 ?
                            data.resumeOverview.strongSections.map((section, index) => (
                              <li key={index}>{section}</li>
                            )) :
                            <li className="text-muted">None identified</li>
                          }
                        </ul>
                      </div>

                      <div className="section-box weak-sections">
                        <h5>Weak Sections</h5>
                        <ul>
                          {data?.resumeOverview?.weakSections?.length > 0 ?
                            data.resumeOverview.weakSections.map((section, index) => (
                              <li key={index}>{section}</li>
                            )) :
                            <li className="text-muted">None identified</li>
                          }
                        </ul>
                      </div>

                      <div className="section-box missing-sections">
                        <h5>Missing Sections</h5>
                        <ul>
                          {data?.resumeOverview?.missingSections?.length > 0 ?
                            data.resumeOverview.missingSections.map((section, index) => (
                              <li key={index}>{section}</li>
                            )) :
                            <li className="text-muted">None identified</li>
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Skills Analysis Card */}
              <Card className="analysis-card mb-4">
                <Card.Header className="bg-info text-white">
                  <h4 className="m-0">Skills Analysis</h4>
                </Card.Header>
                <Card.Body>
                  <div className="skills-grid">
                    <div className="skills-present">
                      <h5>Skills Present in Your Resume</h5>
                      <ul className="skills-list present-skills">
                        {data?.skillsAnalysis?.presentSkills?.length > 0 ?
                          data.skillsAnalysis.presentSkills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          )) :
                          <li className="text-muted">None identified</li>
                        }
                      </ul>
                    </div>

                    <div className="skills-missing">
                      <h5>Missing Skills for {targetJob} Role</h5>
                      <ul className="skills-list missing-skills">
                        {data?.skillsAnalysis?.missingSkills?.length > 0 ?
                          data.skillsAnalysis.missingSkills.map((item, index) => (
                            <li key={index}>
                              <strong>{item.skill}</strong>
                              <p>{item.importance}</p>
                            </li>
                          )) :
                          <li className="text-muted">None identified</li>
                        }
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Improvement Suggestions Card */}
              <Card className="analysis-card mb-4">
                <Card.Header className="bg-success text-white">
                  <h4 className="m-0">Resume Improvement Suggestions</h4>
                </Card.Header>
                <Card.Body>
                  {data?.improvementSuggestions?.length > 0 ?
                    data.improvementSuggestions.map((item, index) => (
                      <div key={index} className="improvement-item">
                        <h5>{item.section}</h5>
                        <div className="original-content">
                          <h6>Original Content:</h6>
                          <blockquote>{item.originalContent}</blockquote>
                        </div>
                        <div className="suggested-revision">
                          <h6>Suggested Revision:</h6>
                          <p>{item.suggestedRevision}</p>
                        </div>
                        <div className="explanation">
                          <h6>Why This Helps:</h6>
                          <p>{item.explanation}</p>
                        </div>
                      </div>
                    )) :
                    <p className="text-muted">No specific improvements suggested</p>
                  }
                </Card.Body>
              </Card>

              {/* Skill Development Card */}
              <Card className="analysis-card mb-4">
                <Card.Header className="bg-warning text-dark">
                  <h4 className="m-0">Skill Development Recommendations</h4>
                </Card.Header>
                <Card.Body>
                  {data?.skillDevelopment?.length > 0 ?
                    data.skillDevelopment.map((item, index) => (
                      <div key={index} className="skill-development-item">
                        <h5>{item.skill}</h5>
                        <div className="resources">
                          <h6>Recommended Resources:</h6>
                          <ul>
                            {item.resources?.length > 0 ?
                              item.resources.map((resource, i) => (
                                <li key={i}>{resource}</li>
                              )) :
                              <li className="text-muted">None provided</li>
                            }
                          </ul>
                        </div>
                        <div className="project-ideas">
                          <h6>Project Ideas:</h6>
                          <ul>
                            {item.projectIdeas?.length > 0 ?
                              item.projectIdeas.map((project, i) => (
                                <li key={i}>{project}</li>
                              )) :
                              <li className="text-muted">None provided</li>
                            }
                          </ul>
                        </div>
                      </div>
                    )) :
                    <p className="text-muted">No specific skill development recommendations</p>
                  }
                </Card.Body>
              </Card>

              {/* ATS Optimization Card */}
              <Card className="analysis-card mb-4">
                <Card.Header className="bg-danger text-white">
                  <h4 className="m-0">ATS Optimization Tips</h4>
                </Card.Header>
                <Card.Body>
                  <div className="ats-content">
                    <div className="missing-keywords">
                      <h5>Missing Keywords</h5>
                      <ul>
                        {data?.atsOptimization?.missingKeywords?.length > 0 ?
                          data.atsOptimization.missingKeywords.map((keyword, index) => (
                            <li key={index}>{keyword}</li>
                          )) :
                          <li className="text-muted">None identified</li>
                        }
                      </ul>
                    </div>

                    <div className="formatting-tips">
                      <h5>Formatting Tips</h5>
                      <ul>
                        {data?.atsOptimization?.formattingTips?.length > 0 ?
                          data.atsOptimization.formattingTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          )) :
                          <li className="text-muted">None provided</li>
                        }
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Extracted Text Card */}
              <Card className="analysis-card">
                <Card.Header className="bg-secondary text-white">
                  <h4 className="m-0">Extracted Resume Text</h4>
                </Card.Header>
                <Card.Body>
                  <pre className="extracted-text">
                    {data?.extractedText || resumeText.substring(0, 500) + "..."}
                  </pre>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DirectResumeInput;
