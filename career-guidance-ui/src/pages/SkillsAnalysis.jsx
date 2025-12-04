import React, { useState } from "react";
import { Upload, FileText, Briefcase, TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";

function SkillsAnalysis() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const convertMarkdownToHtml = (text) => {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  };

  const parseResponse = (text) => {
    const matchPercentMatch = text.match(/(\d+)%/);
    const matchPercent = matchPercentMatch ? parseInt(matchPercentMatch[1]) : 0;

    const sections = {
      matchPercent,
      keySkills: [],
      missingSkills: [],
      suggestions: []
    };

    const lines = text.split('\n').filter(line => line.trim());
    let currentSection = '';

    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('key skills') || lower.includes('matched skills')) {
        currentSection = 'keySkills';
      } else if (lower.includes('missing') || lower.includes('gaps')) {
        currentSection = 'missingSkills';
      } else if (lower.includes('suggestion') || lower.includes('improvement')) {
        currentSection = 'suggestions';
      } else if (line.match(/^[-•*]\s/) || line.match(/^\d+\.\s/)) {
        const cleanLine = line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '').trim();
        if (cleanLine && currentSection) {
           sections[currentSection].push(convertMarkdownToHtml(cleanLine));
        }
      }
    });

    return sections;
  };

  const handleSubmit = async () => {
    setError("");
    setAnalysis(null);
    
    if (!jobDesc.trim()) {
      setError("Please enter a job description");
      return;
    }
    
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDesc);

      const response = await fetch(
  `${window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://ai-powered-career-navigator-2.onrender.com'}/api/analyze`,
  {
    method: "POST",
    body: formData,
  }
);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      const parsed = parseResponse(data.response);
      setAnalysis(parsed);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An error occurred while analyzing the resume");
    } finally {
      setLoading(false);
    }
  };

  const CircularProgress = ({ percent }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    const color = percent >= 70 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";

    return (
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg style={{ transform: 'rotate(-90deg)' }} width="180" height="180">
          <circle cx="90" cy="90" r={radius} stroke="#374151" strokeWidth="12" fill="none" />
          <circle
            cx="90" cy="90" r={radius} stroke={color} strokeWidth="12" fill="none"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffffff' }}>{percent}%</div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>Match</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      padding: '3rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            backgroundColor: 'transparent',
            border: '2px solid #ffffff',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <Briefcase style={{ width: '32px', height: '32px', color: '#ffffff' }} />
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#ffffff',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            ATS Resume Checker
          </h1>
        </div>

        {/* Main Content Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0',
          padding: '3rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left Labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8.5rem', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText style={{ width: '20px', height: '20px', color: '#000' }} />
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#000' }}>Job Description</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload style={{ width: '20px', height: '20px', color: '#000' }} />
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#000' }}>Upload Resume (PDF)</span>
              </div>
            </div>

            {/* Job Description - Black text on white background */}
            <div>
              <textarea
                placeholder="Paste the job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                style={{
                  width: '100%',
                  height: '150px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              />
            </div>

            {/* File Upload */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                height: '150px',
                border: '2px dashed #d1d5db',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#fafafa'
              }}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                {file ? (
                  <>
                    <CheckCircle style={{ width: '40px', height: '40px', color: '#10b981', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#000', marginBottom: '0.25rem' }}>{file.name}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Click to change</p>
                  </>
                ) : (
                  <>
                    <Upload style={{ width: '40px', height: '40px', color: '#9ca3af', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#000', marginBottom: '0.25rem' }}>
                      Drop your resume here
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>or click to browse</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px 48px',
                backgroundColor: loading ? '#9ca3af' : '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'start',
            gap: '0.75rem'
          }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', margin: '0 0 0.25rem 0' }}>Error</h3>
              <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div style={{ marginTop: '3rem' }}>
            {/* Match Percentage */}
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#ffffff', marginBottom: '2rem' }}>
                Match Score
              </h2>
              <CircularProgress percent={analysis.matchPercent} />
              <p style={{ marginTop: '1.5rem', fontSize: '16px', color: '#9ca3af' }}>
                Your resume matches <span style={{ fontWeight: '600', color: '#ffffff' }}>{analysis.matchPercent}%</span> of the job requirements
              </p>
            </div>

            {/* Analysis Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Matched Skills */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#065f46',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle style={{ width: '24px', height: '24px', color: '#10b981' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                    Matched Skills
                  </h3>
                </div>
                {analysis.keySkills.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {analysis.keySkills.map((skill, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem',
                        marginBottom: '0.75rem',
                        fontSize: '14px',
                        color: '#d1d5db'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          marginTop: '0.5rem',
                          flexShrink: 0
                        }}></span>
                        <span dangerouslySetInnerHTML={{ __html: skill }}></span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                    No matched skills identified
                  </p>
                )}
              </div>

              {/* Missing Skills */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#7f1d1d',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <XCircle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                    Missing Skills
                  </h3>
                </div>
                {analysis.missingSkills.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {analysis.missingSkills.map((skill, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem',
                        marginBottom: '0.75rem',
                        fontSize: '14px',
                        color: '#d1d5db'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#ef4444',
                          borderRadius: '50%',
                          marginTop: '0.5rem',
                          flexShrink: 0
                        }}></span>
                        <span dangerouslySetInnerHTML={{ __html: skill }}></span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                    No missing skills identified
                  </p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#1e40af',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                    Improvement Suggestions
                  </h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '1rem',
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: '#374151',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#d1d5db'
                    }}>
                      <span style={{
                        fontWeight: '600',
                        color: '#3b82f6',
                        flexShrink: 0
                      }}>{idx + 1}.</span>
                      <span dangerouslySetInnerHTML={{ __html: suggestion }}></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillsAnalysis;