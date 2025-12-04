import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import { Clock, Trophy } from 'lucide-react';

const TestPage = () => {
  const navigate = useNavigate();
  const { mcqQuestions, subject, setAnswers } = useInterview();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!mcqQuestions || mcqQuestions.length === 0) {
      navigate('/mock-interviews');
      return;
    }
  }, [mcqQuestions, navigate]);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleAnswer = (qId, optionIndex) => {
    setUserAnswers({ ...userAnswers, [qId]: optionIndex });
  };

  const handleSubmit = () => {
    setTimerActive(false);
    setAnswers(userAnswers);
    navigate('/mock-interviews/results');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mcqQuestions || mcqQuestions.length === 0) {
    return null;
  }

  const q = mcqQuestions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
              Question {currentQ + 1} of {mcqQuestions.length}
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
              timeLeft < 60 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : timeLeft < 180
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              <Clock size={18} />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{width: `${((currentQ + 1) / mcqQuestions.length) * 100}%`}}
            ></div>
          </div>

          {/* Question */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800">{q.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(q.id, idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all transform hover:scale-[1.02] text-black ${
                  userAnswers[q.id] === idx
                    ? 'bg-blue-100 border-blue-500 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span className="font-semibold mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentQ > 0 && (
              <button
                onClick={() => setCurrentQ(currentQ - 1)}
                className="px-6 py-3 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all transform active:scale-95"
              >
                Previous
              </button>
            )}
            
            {currentQ < mcqQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform active:scale-95"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                Submit Test <Trophy size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
