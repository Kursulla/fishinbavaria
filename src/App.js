import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import CategoryPage from "./pages/category/CategoryPage";
import TestsPage from "./pages/tests/TestsPage";
import Home from "./pages/Home";
import MarkedPage from "./pages/marked-questions/MarkedPage";
import TestCategoriesPage from "./pages/test-categories/TestCategoriesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/test-categories" element={<TestCategoriesPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/marked" element={<MarkedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
