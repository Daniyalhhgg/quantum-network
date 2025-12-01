import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// ===== ANIMATIONS =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(0, 245, 160, 0.4); }
  50% { box-shadow: 0 0 35px rgba(0, 245, 160, 0.9); }
`;

const modalPop = keyframes`
  0% { transform: scale(0.7); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

// ===== STYLED COMPONENTS =====
const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 10% 90%, #0a0e1f, #050812);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 900;
  text-align: center;
  background: linear-gradient(90deg, #00f5a0, #00d9f5, #8a2be2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.9s ease-out;
`;

const LoginBox = styled.form`
  background: rgba(15, 25, 50, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 245, 160, 0.3);
  border-radius: 20px;
  padding: 2.8rem 2.2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 1s ease-out;
  z-index: 10;
`;

// Input styles (same as before)
const InputWrapper = styled.div` position: relative; margin-bottom: 1.5rem; `;
const Input = styled.input`
  width: 100%;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid rgba(0, 245, 160, 0.4);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 1.05rem;
  outline: none;
  transition: all 0.3s ease;
  &::placeholder { color: #88aabb; }
  &:focus { border-color: #00f5a0; box-shadow: 0 0 20px rgba(0, 245, 160, 0.4); }
`;
const Label = styled.label`
  position: absolute;
  top: -10px;
  left: 16px;
  background: #050812;
  padding: 0 10px;
  font-size: 0.85rem;
  color: #00f5a0;
  font-weight: 700;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  text-align: center;
  font-size: 0.95rem;
  margin: 0.5rem 0 1rem;
  font-weight: 500;
  padding: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${glowPulse} 4s infinite;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0, 245, 160, 0.6); }
  &:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #aabbee;
  font-size: 1rem;
  z-index: 10;
  a { color: #00f5a0; font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } }
`;

// ===== SUCCESS MODAL =====
const SuccessModal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(5, 8, 18, 0.95);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ModalContent = styled.div`
  background: rgba(15, 25, 50, 0.9);
  border: 2px solid #00f5a0;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 380px;
  width: 90%;
  animation: ${modalPop} 0.7s ease-out;
  box-shadow: 0 0 60px rgba(0, 245, 160, 0.6);
  position: relative;
  overflow: hidden;
`;

const SuccessTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 1rem;
`;

const SuccessMessage = styled.p`
  color: #bfffe6;
  font-size: 1.1rem;
  margin: 0.5rem 0 1.5rem;
`;

const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: conic-gradient(from 0deg, #00f5a0, #00d9f5, #8a2be2, #00f5a0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #000;
  animation: ${glowPulse} 2s infinite;
`;

// Confetti Effect
const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 20px;
  background: ${props => props.color};
  opacity: 0.9;
  animation: ${confettiFall} ${props => props.duration}s linear forwards;
  left: ${props => props.left}%;
  top: -20px;
`;

// ===== MAIN LOGIN COMPONENT =====
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Save to localStorage
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      login(data.user);

      // Show beautiful success modal
      setUserName(data.user.name || data.user.email.split("@")[0]);
      setShowSuccess(true);

      // Redirect after 2.5 seconds
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2500);

    } catch (err) {
      setError(err.message || "Network error. Please try again.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate random confetti
  const confettiColors = ["#00f5a0", "#00d9f5", "#8a2be2", "#ff6b6b", "#ffd93d"];
  const confettis = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: Math.random() * 100,
    duration: 2 + Math.random() * 3
  }));

  return (
    <>
      <Container>
        <Title>Welcome Back</Title>
        <LoginBox onSubmit={handleSubmit}>
          <InputWrapper>
            <Input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
            <Label>Email Address</Label>
          </InputWrapper>
          <InputWrapper>
            <Input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required autoComplete="current-password" />
            <Label>Password</Label>
          </InputWrapper>
          {error && <ErrorText>{error}</ErrorText>}
          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login Securely"}
          </LoginButton>
        </LoginBox>
        <Footer>
          New to Quantum? <Link to="/register">Create Account Free</Link>
        </Footer>
      </Container>

      {/* SUCCESS MODAL WITH CONFETTI */}
      {showSuccess && (
        <SuccessModal>
          {confettis.map(c => (
            <Confetti key={c.id} color={c.color} left={c.left} duration={c.duration} />
          ))}
          <ModalContent>
            <CheckIcon>✓</CheckIcon>
            <SuccessTitle>Welcome Back!</SuccessTitle>
            <SuccessMessage>
              Hello <strong>{userName}</strong>,<br />
              You're now logged in successfully!
            </SuccessMessage>
            <div style={{ fontSize: "0.9rem", color: "#88aabb" }}>
              Redirecting to dashboard...
            </div>
          </ModalContent>
        </SuccessModal>
      )}
    </>
  );
};

export default Login;