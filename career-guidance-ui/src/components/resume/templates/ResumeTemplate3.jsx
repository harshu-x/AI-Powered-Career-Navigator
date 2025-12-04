import React, { forwardRef, useState } from 'react';

// Creative Template
const ResumeTemplate3 = forwardRef(({ data }, ref) => {
  // State for profile image
  const [profileImage, setProfileImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    personalInfo,
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements,
    languages,
    hobbies
  } = data;

  return (
    <div
      ref={ref}
      className="resume-template"
      style={{
        width: '8.5in',
        minHeight: '11in',
        backgroundColor: 'white',
        color: '#333',
        fontFamily: 'Roboto, Arial, sans-serif',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        pageBreakAfter: 'always',
        printColorAdjust: 'exact'
      }}
    >
      {/* Background Design Element */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2in',
        backgroundColor: '#9b59b6',
        zIndex: 0
      }}></div>

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '30px 40px',
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Profile Image */}
        <div style={{
          marginRight: '20px',
          position: 'relative'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                fontSize: '36px',
                color: '#9b59b6',
                fontWeight: 'bold'
              }}>
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              id="profile-image-upload-3"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'white',
            color: '#9b59b6',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            +
          </div>
        </div>

        <div>
          <h1 style={{
            margin: '0',
            fontSize: '36px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '3px'
          }}>
            {personalInfo.name}
          </h1>
          <div style={{ margin: '15px 0' }}>
            {personalInfo.email && (
              <span style={{ margin: '0 10px' }}>{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span style={{ margin: '0 10px' }}>{personalInfo.phone}</span>
            )}
            {personalInfo.address && (
              <span style={{ margin: '0 10px' }}>{personalInfo.address}</span>
            )}
          </div>
          <div>
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}
              >
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}
              >
                GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a
                href={personalInfo.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 40px 40px', position: 'relative', zIndex: 1 }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            marginTop: '-20px'
          }}>
            <h2 style={{
              margin: '0 0 15px 0',
              color: '#9b59b6',
              fontSize: '18px',
              borderBottom: '2px solid #9b59b6',
              paddingBottom: '5px'
            }}>
              Professional Summary
            </h2>
            <p style={{ textAlign: 'justify', margin: '0' }}>{personalInfo.summary}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Left Column */}
          <div style={{ width: '60%', paddingRight: '20px' }}>
            {/* Experience */}
            {experience && experience.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  color: '#9b59b6',
                  fontSize: '18px',
                  borderBottom: '2px solid #9b59b6',
                  paddingBottom: '5px'
                }}>
                  Work Experience
                </h2>
                {experience.map((exp, index) => (
                  <div key={index} style={{
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#9b59b6' }}>
                        {exp.title}
                      </h3>
                      <span style={{ fontStyle: 'italic', fontSize: '14px' }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p style={{ margin: '5px 0', fontStyle: 'italic', color: '#7f8c8d' }}>
                      {exp.company}{exp.location && `, ${exp.location}`}
                    </p>
                    <div style={{ marginTop: '10px' }}>
                      {exp.responsibilities.split('\n').map((item, i) => (
                        <p key={i} style={{ margin: '5px 0', textAlign: 'justify' }}>
                          {item.startsWith('-') ? item : `• ${item}`}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  color: '#9b59b6',
                  fontSize: '18px',
                  borderBottom: '2px solid #9b59b6',
                  paddingBottom: '5px'
                }}>
                  Projects
                </h2>
                {projects.map((project, index) => (
                  <div key={index} style={{
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#9b59b6' }}>
                        {project.title}
                      </h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#9b59b6', textDecoration: 'none', fontSize: '14px' }}
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '10px 0', textAlign: 'justify' }}>{project.description}</p>
                    <p style={{ margin: '5px 0', fontStyle: 'italic', color: '#7f8c8d' }}>
                      <strong>Technologies:</strong> {project.technologies}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ width: '40%' }}>
            {/* Education */}
            {education && education.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  color: '#9b59b6',
                  fontSize: '18px',
                  borderBottom: '2px solid #9b59b6',
                  paddingBottom: '5px'
                }}>
                  Education
                </h2>
                {education.map((edu, index) => (
                  <div key={index} style={{
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#9b59b6' }}>
                      {edu.degree}
                    </h3>
                    <p style={{ margin: '5px 0', fontStyle: 'italic', color: '#7f8c8d' }}>
                      {edu.institution} • {edu.year}
                    </p>
                    {edu.gpa && (
                      <p style={{ margin: '5px 0' }}>GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p style={{ marginTop: '5px', textAlign: 'justify' }}>{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {(skills.technical.length > 0 || skills.soft.length > 0) && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  color: '#9b59b6',
                  fontSize: '18px',
                  borderBottom: '2px solid #9b59b6',
                  paddingBottom: '5px'
                }}>
                  Skills
                </h2>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {skills.technical.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#9b59b6' }}>Technical Skills</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {skills.technical.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#9b59b6',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '15px',
                            margin: '0 5px 5px 0',
                            fontSize: '12px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.soft.length > 0 && (
                    <div>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#9b59b6' }}>Soft Skills</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {skills.soft.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#8e44ad',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '15px',
                            margin: '0 5px 5px 0',
                            fontSize: '12px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  color: '#9b59b6',
                  fontSize: '18px',
                  borderBottom: '2px solid #9b59b6',
                  paddingBottom: '5px'
                }}>
                  Certifications
                </h2>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <ul style={{ paddingLeft: '20px', margin: '0' }}>
                    {certifications.map((cert, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Additional Sections */}
            <div style={{
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {/* Achievements */}
              {achievements && achievements.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{
                    margin: '0 0 10px 0',
                    color: '#9b59b6',
                    fontSize: '16px'
                  }}>
                    Achievements
                  </h2>
                  <ul style={{ paddingLeft: '20px', margin: '0' }}>
                    {achievements.map((achievement, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{
                    margin: '0 0 10px 0',
                    color: '#9b59b6',
                    fontSize: '16px'
                  }}>
                    Languages
                  </h2>
                  <p style={{ margin: '0' }}>{languages.join(', ')}</p>
                </div>
              )}

              {/* Hobbies */}
              {hobbies && hobbies.length > 0 && (
                <div>
                  <h2 style={{
                    margin: '0 0 10px 0',
                    color: '#9b59b6',
                    fontSize: '16px'
                  }}>
                    Hobbies & Interests
                  </h2>
                  <p style={{ margin: '0' }}>{hobbies.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResumeTemplate3;
