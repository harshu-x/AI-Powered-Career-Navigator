// server.js - Complete Backend Server with Bug Fixes
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI with better error handling
let genAI;
try {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ ERROR: GOOGLE_API_KEY or GEMINI_API_KEY not found in environment variables');
    process.exit(1);
  }
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ Gemini AI initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error);
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Interview Prep API is running!',
    version: '1.0.0',
    endpoints: {
      health: 'GET /',
      mcq: 'POST /api/generate-mcqs',
      study: 'POST /api/generate-study-material',
      resume: 'POST /api/analyze',
      chat: 'POST /api/chat'
    }
  });
});

// Generate MCQ Questions
app.post('/api/generate-mcqs', async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject || subject.trim() === '') {
      return res.status(400).json({ 
        error: 'Subject is required',
        success: false 
      });
    }

    console.log(`📝 Generating MCQs for subject: ${subject}`);

    const model = genAI.getGenerativeModel({ model: 'models/gemini-pro-latest' });

    const prompt = `You are an expert technical interviewer. Generate exactly 10 multiple choice questions about "${subject}" suitable for technical interviews.

Requirements:
- Questions should be practical and relevant to real-world scenarios
- Each question must have exactly 4 options
- Only one option should be correct
- Include a brief explanation for the correct answer
- Mix difficulty levels: 3 easy, 4 medium, 3 hard
- Focus on concepts, best practices, and problem-solving

Return ONLY a valid JSON array with this exact structure (no additional text, no markdown, no code blocks):
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation why this is correct",
    "difficulty": "easy"
  }
]

Subject: ${subject}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '')
               .replace(/```\n?/g, '')
               .replace(/^\s+|\s+$/g, '')
               .trim();

    // Parse JSON
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate structure
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }

    if (questions.length === 0) {
      throw new Error('No questions generated');
    }

    // Validate each question has required fields
    questions.forEach((q, index) => {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.correct === undefined) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
    });

    console.log(`✅ Successfully generated ${questions.length} MCQs`);
    res.json({ success: true, questions });

  } catch (error) {
    console.error('❌ Error generating MCQs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
      message: error.message
    });
  }
});

// Generate Study Material
app.post('/api/generate-study-material', async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject || subject.trim() === '') {
      return res.status(400).json({ 
        error: 'Subject is required',
        success: false 
      });
    }

    console.log(`📚 Generating study material for: ${subject}`);

    const model = genAI.getGenerativeModel({ model: 'models/gemini-pro-latest' });

    const prompt = `You are an expert technical educator. Create comprehensive study material about "${subject}" for technical interview preparation.

Generate exactly 5 important topics with detailed explanations that cover:
1. Core concepts and fundamentals
2. Key advantages and use cases
3. Common interview questions
4. Best practices and real-world applications

Return ONLY a valid JSON array with this exact structure (no additional text, no markdown, no code blocks):
[
  {
    "id": 1,
    "question": "Topic/Question title",
    "answer": "Detailed explanation with multiple paragraphs. Use bullet points with • symbol for lists. Include practical examples and make it comprehensive and easy to understand."
  }
]

Subject: ${subject}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response
    text = text.replace(/```json\n?/g, '')
               .replace(/```\n?/g, '')
               .replace(/^\s+|\s+$/g, '')
               .trim();

    // Parse JSON
    let studyMaterial;
    try {
      studyMaterial = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate structure
    if (!Array.isArray(studyMaterial)) {
      throw new Error('Response is not an array');
    }

    if (studyMaterial.length === 0) {
      throw new Error('No study material generated');
    }

    // Validate each item has required fields
    studyMaterial.forEach((item, index) => {
      if (!item.question || !item.answer) {
        throw new Error(`Invalid study material structure at index ${index}`);
      }
    });

    console.log(`✅ Successfully generated ${studyMaterial.length} study topics`);
    res.json({ success: true, studyMaterial });

  } catch (error) {
    console.error('❌ Error generating study material:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate study material',
      message: error.message
    });
  }
});

// Analyze Resume
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  let pdfPath = null;

  try {
    const jobDescription = req.body.jobDescription;
    pdfPath = req.file?.path;

    console.log('📄 Analyzing resume...');

    // Validation
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ 
        error: 'Job description is required',
        success: false 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        error: 'Resume file is required',
        success: false 
      });
    }

    // Read PDF file as base64
    const pdfData = fs.readFileSync(pdfPath, { encoding: 'base64' });

    // Use correct model name that supports PDF
    const model = genAI.getGenerativeModel({ model: 'models/gemini-pro-latest' });

    const prompt = `Analyze this resume against the following job description and provide a detailed analysis:

1. **Match Percentage**: Calculate how well the resume matches the job description (0-100%)
2. **Key Skills Matched**: List the skills from the resume that match the job requirements
3. **Missing Skills**: List important skills mentioned in the job description but not found in the resume
4. **Suggestions for Improvement**: Provide specific, actionable suggestions to improve the resume

Format your response in a clear, structured way with headers and bullet points.

Job Description:
${jobDescription}`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfData,
        },
      },
    ]);

    // Get the response text
    const responseText = result.response.text();

    console.log('✅ Resume analysis completed');
    res.json({ 
      success: true,
      response: responseText 
    });

    // Delete file after successful processing
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log('🗑️ Temporary file deleted');
    }

  } catch (error) {
    console.error('❌ Resume Analysis Error:', error);

    // Clean up file on error
    if (pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Send detailed error response
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Chat endpoint for career guidance
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        error: 'Message is required',
        success: false 
      });
    }

    console.log(`💬 Processing chat message: ${message.substring(0, 50)}...`);

    const model = genAI.getGenerativeModel({ model: 'models/gemini-pro-latest' });

    const prompt = `You are a professional career guidance assistant specializing in:
- Career advice and planning
- Interview preparation tips
- Resume and cover letter guidance
- Job search strategies
- Professional development
- Workplace skills and soft skills

Only answer career-related questions. If the question is not related to careers, politely redirect the user to career topics.

User Question: ${message}

Provide a helpful, professional, and encouraging response.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log('✅ Chat response generated');
    res.json({ 
      success: true,
      reply: response 
    });

  } catch (error) {
    console.error('❌ Chat Error:', error);
    res.status(500).json({ 
      success: false,
      reply: 'Sorry, I encountered an error. Please try again.',
      error: error.message 
    });
  }
});

// Clean up old uploads (run every hour)
const cleanupOldFiles = () => {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  
  if (!fs.existsSync(uploadsPath)) return;

  const files = fs.readdirSync(uploadsPath);
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  files.forEach(file => {
    const filePath = path.join(uploadsPath, file);
    const stats = fs.statSync(filePath);
    
    if (now - stats.mtimeMs > oneHour) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Cleaned up old file: ${file}`);
    }
  });
};

// Run cleanup every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: {
      health: 'GET /',
      mcq: 'POST /api/generate-mcqs',
      study: 'POST /api/generate-study-material',
      resume: 'POST /api/analyze',
      chat: 'POST /api/chat'
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack);
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB' 
      });
    }
    return res.status(400).json({ 
      error: `Upload error: ${err.message}` 
    });
  }

  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('🚀 ========================================\n');
  console.log('📚 Available API Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/                          - Health check`);
  console.log(`   POST http://localhost:${PORT}/api/generate-mcqs         - Generate MCQ questions`);
  console.log(`   POST http://localhost:${PORT}/api/generate-study-material - Generate study material`);
  console.log(`   POST http://localhost:${PORT}/api/analyze               - Analyze resume`);
  console.log(`   POST http://localhost:${PORT}/api/chat                  - Career guidance chat`);
  console.log('\n✅ Server ready to accept requests!\n');
});