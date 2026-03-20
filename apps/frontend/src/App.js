import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import CategoryPage from "./pages/category/CategoryPage";
import TestsPage from "./pages/tests/TestsPage";
import Home from "./pages/Home";
import MarkedPage from "./pages/marked-questions/MarkedPage";
import TestCategoriesPage from "./pages/test-categories/TestCategoriesPage";
import DocsPage from "./pages/docs/DocsPage";
import AuthGuard from "./features/auth/guards/AuthGuard";
import LoginPage from "./features/auth/pages/LoginPage";
import AdminGuard from "./features/admin/guards/AdminGuard";
import AdminUsersPage from "./features/admin/pages/AdminUsersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={(
            <AuthGuard>
              <Layout />
            </AuthGuard>
          )}
        >
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/test-categories" element={<TestCategoriesPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/marked" element={<MarkedPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route
            path="/admin/users"
            element={(
              <AdminGuard>
                <AdminUsersPage />
              </AdminGuard>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
