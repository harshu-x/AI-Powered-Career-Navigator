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
  // 🔥 HARDCODED Backend URL - Change between local and production
  const API_BASE = 'https://ai-powered-career-navigator-2.onrender.com';  // Production
  // const API_BASE = 'http://localhost:5000';  // Local development (comment out for production)
  
  const API_URL = `${API_BASE}/api`;

  console.log('🔗 API Base URL:', API_BASE);

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
      const url = `${API_URL}/questions`;
      console.log('📡 Fetching MCQs from:', url);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ subject: topic }),
      });

      console.log('📥 Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ MCQs received:', data);

      if (data.success && data.questions) {
        setMcqQuestions(data.questions);
        setSubject(topic);
        return data.questions;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      let errorMsg = 'Failed to load MCQs';
      
      if (err.message.includes('fetch') || err.name === 'TypeError') {
        errorMsg = '❌ Cannot connect to server. Please check your internet connection.';
      } else {
        errorMsg = `❌ ${err.message}`;
      }
      
      setErrorTest(errorMsg);
      console.error('❌ MCQ Error:', err);
      return null;
    } finally {
      setLoadingTest(false);
    }
  };

  const generateStudyMaterial = async (topic) => {
    setLoadingPrepare(true);
    setErrorPrepare('');
    try {
      const url = `${API_URL}/prep`;
      console.log('📡 Fetching study prep from:', url);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ subject: topic }),
      });

      console.log('📥 Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Study prep received:', data);

      if (data.success && data.studyMaterial) {
        setStudyMaterial(data.studyMaterial);
        setSubject(topic);
        return data.studyMaterial;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      let errorMsg = 'Failed to load study content';
      
      if (err.message.includes('fetch') || err.name === 'TypeError') {
        errorMsg = '❌ Cannot connect to server. Please check your internet connection.';
      } else {
        errorMsg = `❌ ${err.message}`;
      }
      
      setErrorPrepare(errorMsg);
      console.error('❌ Study Prep Error:', err);
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