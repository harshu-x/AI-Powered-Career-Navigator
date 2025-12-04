import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import { Trophy, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { mcqQuestions, answers, subject, resetInterview } = useInterview();

  useEffect(() => {
    if (!mcqQuestions || mcqQuestions.length === 0 || !answers || Object.keys(answers).length === 0) {
      navigate('/mock-interviews');
      return;
    }
  }, [mcqQuestions, answers, navigate]);

  const calculateScore = () => {
    let correct = 0;
    mcqQuestions.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  const handleReturnHome = () => {
    resetInterview();
    navigate('/mock-interviews');
  };

  if (!mcqQuestions || mcqQuestions.length === 0) {
    return null;
  }

  const score = calculateScore();
  const percentage = (score / mcqQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 animate-bounce">
              <Trophy className="text-white" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Completed!</h2>
            <p className="text-gray-600">Here's how you performed on {subject}</p>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mb-8 text-white text-center shadow-lg">
            <div className="text-6xl font-bold mb-2">{score}/{mcqQuestions.length}</div>
            <div className="text-2xl mb-3">{percentage.toFixed(0)}% Score</div>
            <div className="text-lg opacity-90">
              {percentage >= 80 ? '🎉 Excellent Work!' : 
               percentage >= 60 ? '👍 Good Job!' : 
               '💪 Keep Practicing!'}
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4 mb-8">
            {mcqQuestions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct;
              
              return (
                <div 
                  key={q.id} 
                  className={`p-5 rounded-xl border-2 transition-all ${
                    isCorrect 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                    ) : (
                      <XCircle className="text-red-600 mt-1 flex-shrink-0" size={24} />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-3 text-lg">
                        Q{idx + 1}: {q.question}
                      </p>
                      
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-2">
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-semibold">Your answer:</span>{' '}
                          <span className={userAnswer !== undefined ? (isCorrect ? 'text-green-700' : 'text-red-700') : 'text-gray-500'}>
                            {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-700">
                            <span className="font-semibold">Correct answer:</span>{' '}
                            {q.options[q.correct]}
                          </p>
                        )}
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold text-blue-700">💡 Explanation:</span>{' '}
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Return Button */}
          <button
            onClick={handleReturnHome}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <RotateCcw size={20} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;