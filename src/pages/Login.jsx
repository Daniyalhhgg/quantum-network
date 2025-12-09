// src/pages/Login.jsx → FINAL + FORGET PASSWORD LINK + PREMIUM
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
  padding: 1rem;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0.5rem;
    padding-top: 50px;
    justify-content: flex-start;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 900;
  text-align: center;
  background: linear-gradient(90deg, #00f5a0, #00d9f5, #8a2be2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.9s ease-out;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 6vw, 2rem);
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: clamp(1.3rem, 7vw, 1.8rem);
    margin-bottom: 0.8rem;
  }
`;

const LoginBox = styled.form`
  background: rgba(15, 25, 50, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 245, 160, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 1s ease-out;
  z-index: 10;
  box-sizing: border-box;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.2rem;
    max-width: 95%;
    border-radius: 14px;
    margin: 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    max-width: 98%;
    border-radius: 12px;
    margin: 0 0.3rem;
  }
  
  @media (max-width: 360px) {
    padding: 0.8rem;
    margin: 0 0.2rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.2rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 245, 160, 0.4);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #88aabb;
    font-size: 0.9rem;
  }

  &:focus {
    border-color: #00f5a0;
    box-shadow: 0 0 20px rgba(0, 245, 160, 0.4);
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 11px 13px;
    font-size: 0.9rem;
    border-radius: 8px;
  }

  @media (max-width: 360px) {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
`;

const Label = styled.label`
  position: absolute;
  top: -9px;
  left: 12px;
  background: #050812;
  padding: 0 8px;
  font-size: 0.8rem;
  color: #00f5a0;
  font-weight: 700;
  z-index: 2;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    left: 10px;
    padding: 0 6px;
    top: -8px;
  }

  @media (max-width: 360px) {
    font-size: 0.7rem;
    top: -7px;
  }
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
  margin: 0.5rem 0 0.8rem;
  font-weight: 500;
  padding: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin: 0.4rem 0 0.7rem;
    padding: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin: 0.3rem 0 0.6rem;
    padding: 0.4rem;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 0.8rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${glowPulse} 4s infinite;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 245, 160, 0.6);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 13px;
    font-size: 1rem;
    margin-top: 0.7rem;
    border-radius: 9px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.95rem;
    margin-top: 0.6rem;
    border-radius: 8px;
  }

  @media (max-width: 360px) {
    padding: 11px;
    font-size: 0.9rem;
  }
`;

const Footer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  color: #aabbee;
  font-size: 0.95rem;
  z-index: 10;
  line-height: 1.6;
  width: 100%;
  max-width: 400px;
  padding: 0 1rem;
  box-sizing: border-box;

  a {
    color: #00f5a0;
    font-weight: 700;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-top: 1.2rem;
    font-size: 0.9rem;
    padding: 0 0.8rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
    font-size: 0.85rem;
    padding: 0 0.6rem;
  }

  @media (max-width: 360px) {
    margin-top: 0.8rem;
    font-size: 0.8rem;
  }
`;

// ===== FORGET PASSWORD LINK (NEW) =====
const ForgotLink = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 0.5rem;
  color: #00f5a0;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-top: 0.4rem;
  }
`;

// ===== SUCCESS MODAL =====
const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 8, 18, 0.95);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.6s ease-out;
  padding: 1rem;

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const ModalContent = styled.div`
  background: rgba(15, 25, 50, 0.9);
  border: 2px solid #00f5a0;
  border-radius: 16px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  max-width: 350px;
  width: 90%;
  animation: ${modalPop} 0.7s ease-out;
  box-shadow: 0 0 60px rgba(0, 245, 160, 0.6);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 2rem 1.2rem;
    border-radius: 14px;
    max-width: 85%;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 12px;
    max-width: 90%;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.8rem;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const SuccessMessage = styled.p`
  color: #bfffe6;
  font-size: 1rem;
  margin: 0.5rem 0 1.2rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin: 0.4rem 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0.3rem 0 0.8rem;
    padding: 0 0.5rem;
  }
`;

const CheckIcon = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 1.2rem;
  background: conic-gradient(from 0deg, #00f5a0, #00d9f5, #8a2be2, #00f5a0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #000;
  animation: ${glowPulse} 2s infinite;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
`;

const Confetti = styled.div`
  position: absolute;
  width: 6px;
  height: 12px;
  background: ${(props) => props.color};
  opacity: 0.9;
  animation: ${confettiFall} ${(props) => props.duration}s linear forwards;
  left: ${(props) => props.left}%;
  top: -20px;

  @media (max-width: 480px) {
    width: 5px;
    height: 10px;
  }
`;

// ===== MAIN COMPONENT =====
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL;

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
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      login(data.user);

      setUserName(data.user.name || data.user.email.split("@")[0]);
      setShowSuccess(true);

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

  const confettiColors = ["#00f5a0", "#00d9f5", "#8a2be2", "#ff6b6b", "#ffd93d"];
  const confettis = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: Math.random() * 100,
    duration: 2 + Math.random() * 3,
  }));

  return (
    <>
      <Container>
        <Title>Welcome Back</Title>
        <LoginBox onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <Label>Email Address</Label>
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <Label>Password</Label>
          </InputWrapper>

          {/* FORGET PASSWORD LINK */}
          <ForgotLink to="/forgot-password">
            Forgot Password?
          </ForgotLink>

          {error && <ErrorText>{error}</ErrorText>}

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login Securely"}
          </LoginButton>
        </LoginBox>

        <Footer>
          New to Quantum? <Link to="/register">Create Account Free</Link>
        </Footer>
      </Container>

      {showSuccess && (
        <SuccessModal>
          {confettis.map((c) => (
            <Confetti 
              key={c.id} 
              color={c.color} 
              left={c.left} 
              duration={c.duration} 
            />
          ))}
          <ModalContent>
            <CheckIcon>Checkmark</CheckIcon>
            <SuccessTitle>Welcome Back!</SuccessTitle>
            <SuccessMessage>
              Hello <strong>{userName}</strong>,<br />
              You're now logged in successfully!
            </SuccessMessage>
            <div style={{ 
              fontSize: "0.8rem", 
              color: "#88aabb",
              marginTop: "0.8rem" 
            }}>
              Redirecting to dashboard...
            </div>
          </ModalContent>
        </SuccessModal>
      )}
    </>
  );
};

export default Login;