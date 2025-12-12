// src/App.js → FINAL + PUBLIC EXPLORER + ALL ROUTES CLEAN
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import TrustCircle from "./pages/TrustCircle";
import Marketplace from "./pages/Marketplace";
import KYC from "./pages/KYC";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import ContactUs from "./pages/ContactUs";
import ForgotPassword from "./pages/ForgotPassword";
import FaceDetection from "./pages/FaceDetection";
import Transaction from "./pages/Transaction"; // ← Blockchain Explorer

// Protected Route Component
import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          {/* PUBLIC ROUTES — Koi Login Nahi Chahiye */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" replace /> : <Home />} 
          />
          
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* PUBLIC BLOCKCHAIN EXPLORER — BINA LOGIN KE OPEN HOGA */}
          <Route path="/transaction" element={<Transaction />} />

          {/* PROTECTED ROUTES — Login Zaroori Hai */}
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
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/facedetection"
            element={
              <ProtectedRoute>
                <FaceDetection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contactus"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTE — Sirf Admin Ko Access */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 404 — Home Pe Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
