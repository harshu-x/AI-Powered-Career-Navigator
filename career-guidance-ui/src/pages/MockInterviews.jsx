import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./interviews/HomePage";
import PreparePage from "./interviews/PreparePage";
import TestPage from "./interviews/TestPage";
import ResultsPage from "./interviews/ResultPage";

const MockInterviews = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/prepare" element={<PreparePage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
};

export default MockInterviews;
