import React, { createContext, useState, useContext } from 'react';

// Create the context
const MCQContext = createContext();

// Create a provider component
export const MCQProvider = ({ children }) => {
  const [mcqState, setMcqState] = useState({
    questions: [],
    subject: '',
    difficulty: '',
    userAnswers: {},
    results: null
  });

  // Update the entire state
  const updateMCQState = (newState) => {
    setMcqState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  // Set questions
  const setQuestions = (questions, subject, difficulty) => {
    setMcqState(prevState => ({
      ...prevState,
      questions,
      subject,
      difficulty,
      userAnswers: {},
      results: null
    }));
  };

  // Update a single answer
  const updateAnswer = (questionIndex, answer) => {
    setMcqState(prevState => ({
      ...prevState,
      userAnswers: {
        ...prevState.userAnswers,
        [questionIndex]: answer
      }
    }));
  };

  // Calculate and set results
  const calculateResults = () => {
    const { questions, userAnswers } = mcqState;
    
    let correctCount = 0;
    const detailedResults = [];
    
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index] || '';
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }
      
      detailedResults.push({
        questionText: question.question,
        userAnswerOption: userAnswer,
        userAnswerText: userAnswer ? question.options[userAnswer] : '',
        correctAnswerOption: question.correctAnswer,
        correctAnswerText: question.options[question.correctAnswer],
        isCorrect,
        explanationText: question.explanation
      });
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    const results = {
      score,
      correctCount,
      totalQuestions: questions.length,
      detailedResults
    };
    
    setMcqState(prevState => ({
      ...prevState,
      results
    }));
    
    return results;
  };

  // Reset the state
  const resetMCQState = () => {
    setMcqState({
      questions: [],
      subject: '',
      difficulty: '',
      userAnswers: {},
      results: null
    });
  };

  // The value that will be provided to consumers of this context
  const contextValue = {
    mcqState,
    updateMCQState,
    setQuestions,
    updateAnswer,
    calculateResults,
    resetMCQState
  };

  return (
    <MCQContext.Provider value={contextValue}>
      {children}
    </MCQContext.Provider>
  );
};

// Custom hook to use the MCQ context
export const useMCQ = () => {
  const context = useContext(MCQContext);
  if (!context) {
    throw new Error('useMCQ must be used within an MCQProvider');
  }
  return context;
};
