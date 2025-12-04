import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import SkillsAnalysis from "./pages/SkillsAnalysis";
import ResumeBuilder from "./pages/ResumeBuilder";
import MockInterviews from "./pages/MockInterviews";
import ChatBotPage from "./pages/ChatBotPage";
import ResumeExtractTest from "./pages/ResumeExtractTest";
import DirectResumeInput from "./pages/DirectResumeInput";
import { MCQProvider } from "./context/MCQContext";
import { InterviewProvider } from "./context/InterviewContext"; 
// Create a custom dark theme
const customTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4299e1", // Blue primary color
    },
    secondary: {
      main: "#ed64a6", // Pink secondary color
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Slightly lighter dark for cards
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});



const App = () => {
  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <Box
            component="main"
            sx={{
              flex: 1,
              py: 4,
              px: 2,
            }}
          >
            <Container maxWidth="xl">
              <MCQProvider>
                <InterviewProvider> {/* 👈 Wrap with InterviewProvider */}
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/skills-analysis" element={<SkillsAnalysis />} />
                    <Route path="/old-skills-analysis" element={<SkillsAnalysis />} />
                    <Route path="/resume-extract-test" element={<ResumeExtractTest />} />
                    <Route path="/direct-resume-input" element={<DirectResumeInput />} />
                    <Route path="/resume-builder" element={<ResumeBuilder />} />
                    <Route path="/mock-interviews/*" element={<MockInterviews />} />
                    <Route path="/chat" element={<ChatBotPage />} />
                  </Routes>
                </InterviewProvider>
              </MCQProvider>
            </Container>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </Router>
  );
};

export default App;
