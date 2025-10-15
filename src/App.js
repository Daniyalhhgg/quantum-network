import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// ✅ Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import TrustCircle from "./pages/TrustCircle";
import Marketplace from "./pages/Marketplace";
import KYC from "./pages/KYC";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

// ✅ Protected route wrapper (prevents access without login)
import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trustcircle"
            element={
              <ProtectedRoute>
                <TrustCircle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kyc"
            element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
