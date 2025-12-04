// src/pages/Home.jsx
import React from "react";
import FeatureCard from "../components/FeatureCard";

const Home = () => {
  const features = [
    { title: "Skill Analysis", description: "Analyze your skills and find gaps." },
    { title: "Job Recommendations", description: "Get personalized job suggestions." },
    { title: "Resume Builder", description: "Improve your resume with AI-powered feedback." },
    { title: "Mock Interviews", description: "Practice interviews and get instant feedback." },
  ];

  return (
    <div>
      <h1>Welcome to Career Guidance Platform</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
        {features.map((feature, index) => (
          <FeatureCard key={index} title={feature.title} description={feature.description} />
        ))}
      </div>
    </div>
  );
};

export default Home;
