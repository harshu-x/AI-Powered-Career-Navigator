import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import { BookOpen, CheckCircle, Trophy } from 'lucide-react';
import { marked } from "marked";

const PreparePage = () => {
  const navigate = useNavigate();
  const { studyMaterial, subject, resetInterview } = useInterview();
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    if (!studyMaterial || studyMaterial.length === 0) {
      navigate('/mock-interviews');
      return;
    }
  }, [studyMaterial, navigate]);

  const handleBack = () => {
    resetInterview();
    navigate('/mock-interviews');
  };

  if (!studyMaterial || studyMaterial.length === 0) {
    return null;
  }

  const q = studyMaterial[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center">
                <BookOpen className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Study Mode</h2>
                <p className="text-sm text-gray-600">{subject}</p>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-all"
            >
              ← Back to Home
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Topic {currentQ + 1} of {studyMaterial.length}</span>
              <span>{Math.round(((currentQ + 1) / studyMaterial.length) * 100)}% Complete</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300"
                style={{width: `${((currentQ + 1) / studyMaterial.length) * 100}%`}}
              ></div>
            </div>
          </div>

          {/* Topic */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-800">{q.question}</h3>
          </div>

          {/* Answer Section - MARKDOWN RENDERED */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2 text-lg">
              <CheckCircle className="text-green-600" size={22} />
              Detailed Explanation:
            </h4>

            <div 
              className="text-gray-800 leading-relaxed prose prose-purple max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(q.answer) }}
            ></div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentQ > 0 && (
              <button
                onClick={() => setCurrentQ(currentQ - 1)}
                className="px-6 py-3 bg-purple-400 text-white rounded-lg font-semibold hover:bg-purple-500 transition-all active:scale-95"
              >
                ← Previous
              </button>
            )}
            
            {currentQ < studyMaterial.length - 1 ? (
              <button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all active:scale-95"
              >
                Next Topic →
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Trophy size={20} /> Complete & Return Home
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreparePage;
 