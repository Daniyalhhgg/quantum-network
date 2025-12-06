// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
`;

const Card = styled(motion.div)`
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  backdrop-filter: blur(16px);
`;

const Title = styled.h2`
  text-align: center;
  color: #e2e8f0;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  margin: 1rem 0;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.7);
  color: #fff;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  margin-top: 1rem;
  background: ${p => p.disabled ? "#334155" : "linear-gradient(90deg, #3b82f6, #2563eb)"};
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  cursor: ${p => p.disabled ? "not-allowed" : "pointer"};
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(59, 130, 246, 0.18);
  color: #3b82f6;
  padding: 12px 24px;
  border-radius: 50px;
  border: 1px solid rgba(59, 130, 246, 0.4);
  font-weight: 600;
  font-size: 0.95rem;
  z-index: 9999;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.3);
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const sendOTP = async () => {
    if (!email) return showToast("Enter email");
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setStep(2);
      showToast("OTP sent! Check your email");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp || !newPass) return showToast("Fill all fields");
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { email, otp, newPassword: newPass });
      showToast("Password reset! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Title>Forgot Password</Title>

        {step === 1 ? (
          <>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              onClick={sendOTP}
              disabled={loading}
              whileHover={{ scale: !loading ? 1.02 : 1 }}
              whileTap={{ scale: !loading ? 0.98 : 1 }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
            />
            <Button
              onClick={resetPassword}
              disabled={loading}
              whileHover={{ scale: !loading ? 1.02 : 1 }}
              whileTap={{ scale: !loading ? 0.98 : 1 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/login" style={{ color: "#60a5fa", fontSize: "0.9rem" }}>
            Back to Login
          </Link>
        </div>

        {toast && (
          <Toast
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {toast}
          </Toast>
        )}
      </Card>
    </Container>
  );
};

export default ForgotPassword;