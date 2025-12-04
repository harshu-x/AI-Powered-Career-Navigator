// AI Helper utility for resume content suggestions
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = process.env.REACT_APP_GEMINI_API_URL;

// Add a check to ensure the API key is loaded
if (!API_KEY) {
  console.error('REACT_APP_GEMINI_API_KEY is not defined in environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
}
/**
 * Generate AI suggestions for resume content
 * @param {string} section - The resume section (e.g., 'summary', 'experience', 'project')
 * @param {object} context - Context information for better suggestions
 * @returns {Promise<string>} - The AI-generated suggestion
 */
// Job-specific skills database
const jobSkillsDatabase = {
  // Software Development Roles
  'software engineer': {
    technical: ['JavaScript', 'Python', 'Java', 'C++', 'SQL', 'Git', 'Data Structures', 'Algorithms', 'REST APIs', 'CI/CD'],
    soft: ['Problem Solving', 'Teamwork', 'Communication', 'Time Management', 'Attention to Detail', 'Critical Thinking']
  },
  'frontend developer': {
    technical: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'TypeScript', 'Responsive Design', 'UI/UX', 'Jest', 'Webpack'],
    soft: ['Creativity', 'Attention to Detail', 'User Empathy', 'Communication', 'Time Management', 'Adaptability']
  },
  'backend developer': {
    technical: ['Node.js', 'Express', 'Python', 'Django', 'SQL', 'NoSQL', 'RESTful APIs', 'Docker', 'AWS', 'Microservices'],
    soft: ['Problem Solving', 'Analytical Thinking', 'Attention to Detail', 'Communication', 'Teamwork', 'Time Management']
  },
  'full stack developer': {
    technical: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'RESTful APIs', 'Git', 'Docker', 'AWS', 'CI/CD'],
    soft: ['Adaptability', 'Problem Solving', 'Communication', 'Time Management', 'Teamwork', 'Self-Learning']
  },
  'mobile developer': {
    technical: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS Development', 'Android Development', 'RESTful APIs', 'Git', 'UI/UX', 'Firebase'],
    soft: ['Attention to Detail', 'User Empathy', 'Problem Solving', 'Communication', 'Adaptability', 'Time Management']
  },
  'devops engineer': {
    technical: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Shell Scripting', 'Monitoring', 'Security'],
    soft: ['Problem Solving', 'Communication', 'Teamwork', 'Attention to Detail', 'Time Management', 'Adaptability']
  },

  // Data Roles
  'data scientist': {
    technical: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow'],
    soft: ['Analytical Thinking', 'Problem Solving', 'Communication', 'Attention to Detail', 'Curiosity', 'Critical Thinking']
  },
  'data analyst': {
    technical: ['SQL', 'Excel', 'Python', 'R', 'Data Visualization', 'Tableau', 'Power BI', 'Statistics', 'ETL', 'Data Cleaning'],
    soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Problem Solving', 'Critical Thinking', 'Storytelling']
  },
  'data engineer': {
    technical: ['Python', 'SQL', 'ETL', 'Hadoop', 'Spark', 'AWS', 'Data Warehousing', 'NoSQL', 'Airflow', 'Docker'],
    soft: ['Problem Solving', 'Attention to Detail', 'Communication', 'Teamwork', 'Time Management', 'Adaptability']
  },
  'machine learning engineer': {
    technical: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Machine Learning', 'Deep Learning', 'SQL', 'Data Preprocessing', 'Model Deployment', 'MLOps'],
    soft: ['Problem Solving', 'Analytical Thinking', 'Communication', 'Attention to Detail', 'Curiosity', 'Teamwork']
  },

  // Design Roles
  'ui designer': {
    technical: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframing', 'UI Design', 'Typography', 'Color Theory', 'Responsive Design', 'Design Systems'],
    soft: ['Creativity', 'Attention to Detail', 'User Empathy', 'Communication', 'Teamwork', 'Time Management']
  },
  'ux designer': {
    technical: ['User Research', 'Usability Testing', 'Wireframing', 'Prototyping', 'Information Architecture', 'Figma', 'Adobe XD', 'User Flows', 'Heuristic Evaluation', 'Accessibility'],
    soft: ['Empathy', 'Communication', 'Problem Solving', 'Critical Thinking', 'Collaboration', 'Adaptability']
  },
  'graphic designer': {
    technical: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Typography', 'Color Theory', 'Layout Design', 'Brand Identity', 'Print Design', 'Digital Design', 'Illustration'],
    soft: ['Creativity', 'Attention to Detail', 'Communication', 'Time Management', 'Adaptability', 'Client Management']
  },

  // Management Roles
  'project manager': {
    technical: ['Project Planning', 'Agile Methodologies', 'Scrum', 'Kanban', 'Risk Management', 'Budgeting', 'Microsoft Project', 'Jira', 'Trello', 'Stakeholder Management'],
    soft: ['Leadership', 'Communication', 'Problem Solving', 'Time Management', 'Negotiation', 'Conflict Resolution']
  },
  'product manager': {
    technical: ['Product Strategy', 'Market Research', 'User Stories', 'Roadmapping', 'Agile Methodologies', 'Data Analysis', 'A/B Testing', 'Wireframing', 'Competitive Analysis', 'Product Metrics'],
    soft: ['Leadership', 'Communication', 'Strategic Thinking', 'Problem Solving', 'Decision Making', 'User Empathy']
  },

  // Marketing Roles
  'digital marketer': {
    technical: ['SEO', 'SEM', 'Google Analytics', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Google Ads', 'Facebook Ads', 'Marketing Automation', 'CRM'],
    soft: ['Creativity', 'Communication', 'Analytical Thinking', 'Adaptability', 'Time Management', 'Strategic Thinking']
  },
  'content writer': {
    technical: ['SEO', 'Content Strategy', 'Copywriting', 'Blog Writing', 'Technical Writing', 'Editing', 'Proofreading', 'WordPress', 'Content Management Systems', 'Keyword Research'],
    soft: ['Creativity', 'Communication', 'Attention to Detail', 'Research Skills', 'Time Management', 'Adaptability']
  },

  // Finance Roles
  'financial analyst': {
    technical: ['Financial Modeling', 'Excel', 'Financial Statement Analysis', 'Forecasting', 'Budgeting', 'Valuation', 'SQL', 'Power BI', 'Bloomberg Terminal', 'Risk Analysis'],
    soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Problem Solving', 'Time Management', 'Critical Thinking']
  },
  'accountant': {
    technical: ['Accounting Principles', 'Financial Reporting', 'Tax Preparation', 'QuickBooks', 'Excel', 'ERP Systems', 'Accounts Payable', 'Accounts Receivable', 'Auditing', 'Regulatory Compliance'],
    soft: ['Attention to Detail', 'Analytical Thinking', 'Integrity', 'Communication', 'Time Management', 'Problem Solving']
  }
};

// Fallback content in case the API fails
const fallbackContent = {
  summary: (context) => `Experienced ${context.experienceLevel || ''} professional with expertise in ${context.targetRole || 'the field'}. Proven track record of delivering high-quality results and collaborating effectively with cross-functional teams. Skilled in ${context.skills?.join(', ') || 'various technical areas'} with a strong focus on continuous improvement and innovation.`,

  experience: (context) => `- Led key initiatives at ${context.company || 'the company'} resulting in significant improvements to processes and outcomes
- Collaborated with cross-functional teams to deliver high-quality solutions on time and within budget
- Implemented innovative approaches that increased efficiency by approximately 20%
- Recognized for exceptional problem-solving abilities and attention to detail`,

  project: (context) => `Developed ${context.title || 'a project'} using ${context.technologies || 'various technologies'} that delivered significant business value. As the ${context.role || 'developer'}, designed and implemented key features while ensuring high code quality and performance optimization.`,

  skills: (context) => {
    const targetRole = context.targetRole?.toLowerCase() || '';
    let technicalSkills = [];
    let softSkills = [];

    // Default technical skills
    let defaultTechnicalSkills = ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'SQL', 'Git', 'API Integration', 'Data Analysis'];

    // Default soft skills
    let defaultSoftSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Critical Thinking'];

    // Try to find exact match in our database
    for (const [jobTitle, skills] of Object.entries(jobSkillsDatabase)) {
      if (targetRole.includes(jobTitle)) {
        technicalSkills = skills.technical;
        softSkills = skills.soft;
        break;
      }
    }

    // If no exact match, try to find partial matches
    if (technicalSkills.length === 0) {
      // Check for general categories
      if (targetRole.includes('develop') || targetRole.includes('program') || targetRole.includes('engineer') || targetRole.includes('code')) {
        technicalSkills = jobSkillsDatabase['software engineer'].technical;
        softSkills = jobSkillsDatabase['software engineer'].soft;
      } else if (targetRole.includes('data') || targetRole.includes('analy')) {
        technicalSkills = jobSkillsDatabase['data analyst'].technical;
        softSkills = jobSkillsDatabase['data analyst'].soft;
      } else if (targetRole.includes('design')) {
        technicalSkills = jobSkillsDatabase['ui designer'].technical;
        softSkills = jobSkillsDatabase['ui designer'].soft;
      } else if (targetRole.includes('manag')) {
        technicalSkills = jobSkillsDatabase['project manager'].technical;
        softSkills = jobSkillsDatabase['project manager'].soft;
      } else if (targetRole.includes('market')) {
        technicalSkills = jobSkillsDatabase['digital marketer'].technical;
        softSkills = jobSkillsDatabase['digital marketer'].soft;
      } else if (targetRole.includes('financ') || targetRole.includes('account')) {
        technicalSkills = jobSkillsDatabase['financial analyst'].technical;
        softSkills = jobSkillsDatabase['financial analyst'].soft;
      } else {
        // Use default if no match found
        technicalSkills = defaultTechnicalSkills;
        softSkills = defaultSoftSkills;
      }
    }

    // Add experience level-specific skills
    if (context.experienceLevel?.toLowerCase().includes('senior') || context.experienceLevel?.toLowerCase().includes('executive')) {
      softSkills = [...softSkills, 'Leadership', 'Strategic Thinking', 'Mentoring', 'Decision Making'];
    }

    return `Technical Skills:
- ${technicalSkills.join('\n- ')}

Soft Skills:
- ${softSkills.join('\n- ')}`;
  }
};

export const getAISuggestion = async (section, context = {}) => {
  try {
    console.log(`Generating ${section} with context:`, context);

    // Create appropriate prompts based on the section
    let prompt = "";

    switch (section) {
      case 'summary':
        prompt = `Write a professional summary for a resume with the following details:
          - Name: ${context.name || 'N/A'}
          - Target role/industry: ${context.targetRole || 'Not specified'}
          - Experience level: ${context.experienceLevel || 'Not specified'}
          - Key skills: ${context.skills?.join(', ') || 'Not specified'}

          Write a concise, impactful professional summary (3-4 sentences) that is ATS-friendly and highlights strengths and career goals.
          Focus on quantifiable achievements and skills relevant to the target role.
          Do not use first-person pronouns (I, me, my).`;
        break;

      case 'experience':
        prompt = `Write professional bullet points for a resume job experience with the following details:
          - Job title: ${context.title || 'N/A'}
          - Company: ${context.company || 'N/A'}
          - Industry: ${context.industry || 'Not specified'}
          - Duration: ${context.duration || 'Not specified'}
          - Key responsibilities: ${context.responsibilities || 'Not specified'}

          Write 3-5 achievement-oriented bullet points that are ATS-friendly.
          Use strong action verbs, include metrics/numbers where possible, and highlight relevant skills.
          Format each point as a separate line starting with a dash (-).`;
        break;

      case 'project':
        prompt = `Write a compelling project description for a resume with the following details:
          - Project title: ${context.title || 'N/A'}
          - Technologies used: ${context.technologies || 'Not specified'}
          - Project type: ${context.type || 'Not specified'}
          - Your role: ${context.role || 'Not specified'}

          Write a concise project description (2-3 sentences) that is ATS-friendly.
          Focus on your contribution, the technologies used, and the impact/results of the project.
          Use technical keywords relevant to your target role.`;
        break;

      case 'skills':
        prompt = `Suggest relevant technical and soft skills for a resume with the following details:
          - Target role/industry: ${context.targetRole || 'Not specified'}
          - Experience level: ${context.experienceLevel || 'Not specified'}
          - Current skills: ${context.currentSkills?.join(', ') || 'Not specified'}

          Provide a list of 8-10 technical skills and 5-7 soft skills that are highly relevant for the target role and would improve ATS matching.
          Format as two separate lists with headers "Technical Skills:" and "Soft Skills:".
          Each skill should be on a new line prefixed with a dash (-).`;
        break;

      default:
        prompt = `Provide professional resume content for the ${section} section that is ATS-friendly and highlights relevant skills and achievements.`;
    }

    console.log("Sending prompt to Gemini API:", prompt);

    // Make API request to Gemini
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response Error:", response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Extract the generated text from the response
    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      console.error("API Error Details:", data.error);
      throw new Error(`API Error: ${data.error.message || JSON.stringify(data.error)}`);
    } else {
      console.error("Unexpected API Response Format:", data);
      throw new Error('Failed to generate content: Unexpected response format');
    }
  } catch (error) {
    console.error('AI Suggestion Error:', error);

    // Use fallback content instead of throwing an error
    console.log('Using fallback content for', section);
    if (fallbackContent[section]) {
      return fallbackContent[section](context);
    }

    // Generic fallback if no specific fallback exists
    return `[AI-generated content for ${section} is currently unavailable. Please try again later or write your own content.]`;
  }
};
