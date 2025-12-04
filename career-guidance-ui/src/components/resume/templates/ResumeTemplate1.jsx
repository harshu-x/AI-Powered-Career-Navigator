import React, { forwardRef, useState } from 'react';

// Professional Template
const ResumeTemplate1 = forwardRef(({ data }, ref) => {
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

  // Ensure the ref is properly attached for PDF generation
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
        padding: '0.5in',
        backgroundColor: 'white',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        margin: '0 auto',
        pageBreakAfter: 'always',
        printColorAdjust: 'exact'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        {/* Profile Image Section */}
        <div style={{ marginRight: '20px', position: 'relative' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
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
                color: '#3498db',
                fontWeight: 'bold'
              }}>
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              id="profile-image-upload"
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
        </div>

        <div style={{ flex: 1, textAlign: 'left' }}>
          <h1 style={{ margin: '0', color: '#2c3e50', fontSize: '28px' }}>{personalInfo.name}</h1>
          <div style={{ margin: '10px 0' }}>
            {personalInfo.email && (
              <span style={{ margin: '0 10px 0 0' }}>{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span style={{ margin: '0 10px 0 0' }}>{personalInfo.phone}</span>
            )}
          </div>
          <div>
            {personalInfo.address && (
              <span style={{ margin: '0 10px 0 0' }}>{personalInfo.address}</span>
            )}
          </div>
          <div style={{ margin: '10px 0' }}>
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '0 10px 0 0', color: '#3498db', textDecoration: 'none' }}
              >
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '0 10px 0 0', color: '#3498db', textDecoration: 'none' }}
              >
                GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a
                href={personalInfo.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '0 10px 0 0', color: '#3498db', textDecoration: 'none' }}
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
            Professional Summary
          </h2>
          <p style={{ textAlign: 'justify' }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
            Work Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{exp.title}</h3>
                <span style={{ fontStyle: 'italic' }}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: '0', fontWeight: 'normal', fontSize: '15px' }}>
                  {exp.company}{exp.location && `, ${exp.location}`}
                </h4>
              </div>
              <div style={{ marginTop: '5px' }}>
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
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{edu.degree}</h3>
                <span>{edu.year}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: '0', fontWeight: 'normal', fontSize: '15px' }}>{edu.institution}</h4>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
              {edu.description && (
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{project.title}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3498db', textDecoration: 'none' }}
                  >
                    Project Link
                  </a>
                )}
              </div>
              <p style={{ margin: '5px 0', textAlign: 'justify' }}>{project.description}</p>
              <p style={{ margin: '5px 0', fontStyle: 'italic' }}>
                <strong>Technologies:</strong> {project.technologies}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
            Skills
          </h2>
          {skills.technical.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{ margin: '10px 0 5px', fontSize: '16px' }}>Technical Skills</h3>
              <p style={{ margin: '0' }}>{skills.technical.join(', ')}</p>
            </div>
          )}
          {skills.soft.length > 0 && (
            <div>
              <h3 style={{ margin: '10px 0 5px', fontSize: '16px' }}>Soft Skills</h3>
              <p style={{ margin: '0' }}>{skills.soft.join(', ')}</p>
            </div>
          )}
        </div>
      )}

      {/* Additional Sections */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div style={{ marginBottom: '20px', width: '48%' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
              Certifications
            </h2>
            <ul style={{ paddingLeft: '20px' }}>
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
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
              Achievements
            </h2>
            <ul style={{ paddingLeft: '20px' }}>
              {achievements.map((achievement, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div style={{ marginBottom: '20px', width: '48%' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
              Languages
            </h2>
            <p>{languages.join(', ')}</p>
          </div>
        )}

        {/* Hobbies */}
        {hobbies && hobbies.length > 0 && (
          <div style={{ marginBottom: '20px', width: '48%' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px', color: '#2c3e50', fontSize: '18px' }}>
              Hobbies & Interests
            </h2>
            <p>{hobbies.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ResumeTemplate1;
