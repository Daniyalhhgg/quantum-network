import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // AuthContext import karein

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
import Profile from "./pages/Profile";
import ContactUs from "./pages/ContactUs";
// ✅ Protected route wrapper (prevents access without login)
import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  const { user } = useContext(AuthContext); // User context get karein

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          {/* Home Route - Condition based on login status */}
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Home />
            } 
          />
          
          {/* Login/Register Routes - Redirect if already logged in */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />

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
         
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
              <Route
            path="/ContactUs"
            element={
              <ProtectedRoute>
                <ContactUs/>
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