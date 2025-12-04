import React, { createContext, useState, useContext } from 'react';

const InterviewContext = createContext();

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider');
  }
  return context;
};

export const InterviewProvider = ({ children }) => {
  const API_BASE =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const API_URL = `${API_BASE}/api`;

  
  const [subject, setSubject] = useState('');
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [studyMaterial, setStudyMaterial] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingPrepare, setLoadingPrepare] = useState(false);
  const [errorTest, setErrorTest] = useState('');
  const [errorPrepare, setErrorPrepare] = useState('');

  const generateMCQs = async (topic) => {
    setLoadingTest(true);
    setErrorTest('');
    try {
      const res = await fetch(`${API_URL}/generate-mcqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: topic }),
      });

      if (!res.ok) throw new Error('MCQ generation failed');

      const data = await res.json();
      setMcqQuestions(data.questions);
      setSubject(topic);
      return data.questions;
    } catch (err) {
      setErrorTest('Failed to load MCQs');
      console.error(err);
      return null;
    } finally {
      setLoadingTest(false);
    }
  };

  const generateStudyMaterial = async (topic) => {
    setLoadingPrepare(true);
    setErrorPrepare('');
    try {
      const res = await fetch(`${API_URL}/generate-study-material`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: topic }),
      });

      if (!res.ok) throw new Error('Study generation failed');

      const data = await res.json();
      setStudyMaterial(data.studyMaterial);
      setSubject(topic);
      return data.studyMaterial;
    } catch (err) {
      setErrorPrepare('Failed to load study content');
      console.error(err);
      return null;
    } finally {
      setLoadingPrepare(false);
    }
  };

  const resetInterview = () => {
    setSubject('');
    setMcqQuestions([]);
    setStudyMaterial([]);
    setAnswers({});
    setErrorTest('');
    setErrorPrepare('');
  };

  return (
    <InterviewContext.Provider
      value={{
        subject,
        mcqQuestions,
        studyMaterial,
        answers,
        setAnswers,
        loadingTest,
        loadingPrepare,
        errorTest,
        errorPrepare,
        generateMCQs,
        generateStudyMaterial,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};