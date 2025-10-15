import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// ===== Animations =====
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 5px #00f5a0; }
  50% { transform: scale(1.03); box-shadow: 0 0 15px #00d9f5; }
  100% { transform: scale(1); box-shadow: 0 0 5px #00f5a0; }
`;

// ===== Styled Components =====
const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(circle at top, #081225, #0b132b);
  font-family: "Inter", sans-serif;
  color: #fff;
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 2.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(0, 245, 160, 0.2);
  box-shadow: 0 8px 20px rgba(0, 245, 160, 0.15);
  animation: ${fadeInUp} 0.8s ease;

  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 18px;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  color: #0b132b;
  outline: none;
  background: #fff;
  transition: box-shadow 0.3s ease;

  &:focus {
    box-shadow: 0 0 12px #00f5a0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${pulseGlow} 3s infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 18px #00f5a0;
  }
`;

const FooterText = styled.div`
  margin-top: 1.5rem;
  color: #aaa;
  font-size: 0.95rem;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease;

  a {
    color: #00f5a0;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ===== Component =====
const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate(); // 👈 useNavigate hook added

  const submit = (e) => {
    e.preventDefault();

    const username = email.split("@")[0] || "user";
    login({ username, email }); // Login context call

    // ✅ Redirect user to Dashboard after login
    navigate("/dashboard");
  };

  return (
    <Section>
      <Title>Welcome Back</Title>
      <Form onSubmit={submit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
      <FooterText>
        Don’t have an account? <Link to="/register">Register</Link>
      </FooterText>
    </Section>
  );
};

export default Login;
