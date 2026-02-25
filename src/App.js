import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Layout";
import LearnFromCategoryPage from "./learn-from-category/LearnFromCategoryPage";
import LearnFromTests from "./learn-from-tests/LearnFromTests";
import Home from "./Home";
import LearnFromMarked from "./learn-from-marked-questions/LearnFromMarked";
import LearnFromTestCategoriesPage from "./learn-from-test-categories/LearnFromTestCategoriesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<LearnFromCategoryPage />} />
          <Route path="/test-categories" element={<LearnFromTestCategoriesPage />} />
          <Route path="/tests" element={<LearnFromTests />} />
          <Route path="/marked" element={<LearnFromMarked />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
