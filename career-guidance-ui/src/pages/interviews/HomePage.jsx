import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import { BookOpen, Brain, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const {
    generateMCQs,
    generateStudyMaterial,
    loadingTest,
    loadingPrepare,
    errorTest,
    errorPrepare,
  } = useInterview();

  const [testSubject, setTestSubject] = useState('');
  const [prepareSubject, setPrepareSubject] = useState('');
  const [localTestError, setLocalTestError] = useState('');
  const [localPrepareError, setLocalPrepareError] = useState('');

  const handleStartTest = async () => {
    if (!testSubject.trim()) {
      setLocalTestError('Please enter a subject for Test!');
      return;
    }
    setLocalTestError('');
    const mcqs = await generateMCQs(testSubject);
    if (mcqs) {
      navigate('/mock-interviews/test');
    }
  };

  const handleStartPrepare = async () => {
    if (!prepareSubject.trim()) {
      setLocalPrepareError('Please enter a subject for Prepare!');
      return;
    }
    setLocalPrepareError('');
    const study = await generateStudyMaterial(prepareSubject);
    if (study) {
      navigate('/mock-interviews/prepare');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg mb-6 transform hover:scale-105 transition-transform">
            <Sparkles className="text-yellow-500" size={24} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interview Prep Hub
            </h1>
          </div>
          <p className="text-gray-700 text-lg">
            Master tech interviews with AI-powered practice
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Test Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 transform hover:-translate-y-1">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Brain className="text-blue-600" size={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Take a Test
            </h2>

            <p className="text-gray-600 mb-6">
              Challenge yourself with 10 AI-generated MCQs.
            </p>

            {/* ✅ BLACK TEXT INPUT */}
            <input
              type="text"
              placeholder="Enter subject (e.g., React.js, Python)"
              className="w-full px-4 py-3 text-black bg-white border-2 border-gray-300 rounded-lg mb-2 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartTest()}
              disabled={loadingTest}
            />

            {(errorTest || localTestError) && (
              <div className="mb-4 bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="text-red-600 mt-0.5" size={18} />
                <p className="text-red-700">
                  {errorTest || localTestError}
                </p>
              </div>
            )}

            <button
              onClick={handleStartTest}
              disabled={loadingTest}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-95"
            >
              {loadingTest ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  Start Test <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          {/* Prepare Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-400 transform hover:-translate-y-1">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="text-purple-600" size={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Prepare & Study
            </h2>

            <p className="text-gray-600 mb-6">
              Learn important concepts with AI-powered explanations.
            </p>

            {/* ✅ BLACK TEXT INPUT */}
            <input
              type="text"
              placeholder="Enter subject (e.g., Data Structures)"
              className="w-full px-4 py-3 text-black bg-white border-2 border-gray-300 rounded-lg mb-2 focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-400"
              value={prepareSubject}
              onChange={(e) => setPrepareSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartPrepare()}
              disabled={loadingPrepare}
            />

            {(errorPrepare || localPrepareError) && (
              <div className="mb-4 bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="text-red-600 mt-0.5" size={18} />
                <p className="text-red-700">
                  {errorPrepare || localPrepareError}
                </p>
              </div>
            )}

            <button
              onClick={handleStartPrepare}
              disabled={loadingPrepare}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-95"
            >
              {loadingPrepare ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  Start Learning <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
