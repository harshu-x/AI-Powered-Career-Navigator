import React, { forwardRef, useState } from 'react';

// Modern Template
const ResumeTemplate2 = forwardRef(({ data }, ref) => {
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
        fontFamily: 'Helvetica, Arial, sans-serif',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        margin: '0 auto',
        display: 'flex',
        pageBreakAfter: 'always',
        printColorAdjust: 'exact'
      }}
    >
      {/* Left Sidebar */}
      <div style={{
        width: '30%',
        backgroundColor: '#34495e',
        color: 'white',
        padding: '1in 20px 20px 20px'
      }}>
        {/* Profile */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#ecf0f1',
            border: '2px solid #3498db',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px auto',
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
                color: '#34495e',
                fontWeight: 'bold'
              }}>
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              id="profile-image-upload-2"
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
            bottom: 15,
            right: '50%',
            transform: 'translateX(35px)',
            backgroundColor: '#3498db',
            color: 'white',
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
          <h1 style={{ margin: '0', fontSize: '20px' }}>{personalInfo.name}</h1>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            borderBottom: '2px solid #3498db',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>
            Contact
          </h2>
          <div style={{ marginBottom: '10px' }}>
            {personalInfo.email && (
              <div style={{ marginBottom: '5px' }}>
                <strong>Email:</strong><br />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div style={{ marginBottom: '5px' }}>
                <strong>Phone:</strong><br />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.address && (
              <div style={{ marginBottom: '5px' }}>
                <strong>Address:</strong><br />
                {personalInfo.address}
              </div>
            )}
          </div>
          <div>
            {personalInfo.linkedin && (
              <div style={{ marginBottom: '5px' }}>
                <strong>LinkedIn:</strong><br />
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3498db', textDecoration: 'none' }}
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div style={{ marginBottom: '5px' }}>
                <strong>GitHub:</strong><br />
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3498db', textDecoration: 'none' }}
                >
                  GitHub Profile
                </a>
              </div>
            )}
            {personalInfo.portfolio && (
              <div style={{ marginBottom: '5px' }}>
                <strong>Portfolio:</strong><br />
                <a
                  href={personalInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3498db', textDecoration: 'none' }}
                >
                  Portfolio Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              borderBottom: '2px solid #3498db',
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              Skills
            </h2>
            {skills.technical.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>Technical Skills</h3>
                <ul style={{ paddingLeft: '20px', margin: '0' }}>
                  {skills.technical.map((skill, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <h3 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>Soft Skills</h3>
                <ul style={{ paddingLeft: '20px', margin: '0' }}>
                  {skills.soft.map((skill, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              borderBottom: '2px solid #3498db',
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              Languages
            </h2>
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              {languages.map((language, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{language}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Hobbies */}
        {hobbies && hobbies.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              borderBottom: '2px solid #3498db',
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              Hobbies & Interests
            </h2>
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              {hobbies.map((hobby, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{hobby}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ width: '70%', padding: '1in 20px 20px 20px' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#34495e',
              borderBottom: '2px solid #3498db',
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              Professional Summary
            </h2>
            <p style={{ textAlign: 'justify', margin: '0' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#34495e',
              borderBottom: '2px solid #3498db',
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              Work Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#34495e' }}>
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

        {/* Education */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#34495e',
              borderBottom: '2px solid #3498db',
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#34495e' }}>
                    {edu.degree}
                  </h3>
                  <span style={{ fontStyle: 'italic', fontSize: '14px' }}>{edu.year}</span>
                </div>
                <p style={{ margin: '5px 0', fontStyle: 'italic', color: '#7f8c8d' }}>
                  {edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}
                </p>
                {edu.description && (
                  <p style={{ marginTop: '5px', textAlign: 'justify' }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#34495e',
              borderBottom: '2px solid #3498db',
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              Projects
            </h2>
            {projects.map((project, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#34495e' }}>
                    {project.title}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3498db', textDecoration: 'none', fontSize: '14px' }}
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p style={{ margin: '5px 0', textAlign: 'justify' }}>{project.description}</p>
                <p style={{ margin: '5px 0', fontStyle: 'italic', color: '#7f8c8d' }}>
                  <strong>Technologies:</strong> {project.technologies}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications & Achievements */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div style={{ marginBottom: '20px', width: '48%' }}>
              <h2 style={{
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: '#34495e',
                borderBottom: '2px solid #3498db',
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                Certifications
              </h2>
              <ul style={{ paddingLeft: '20px', margin: '0' }}>
                {certifications.map((cert, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div style={{ marginBottom: '20px', width: '48%' }}>
              <h2 style={{
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: '#34495e',
                borderBottom: '2px solid #3498db',
                paddingBottom: '5px',
                marginBottom: '15px'
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
        </div>
      </div>
    </div>
  );
});

export default ResumeTemplate2;
