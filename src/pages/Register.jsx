import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";

// ===== Animations =====
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 6px #00f5a0; }
  50% { box-shadow: 0 0 20px #00d9f5; }
  100% { box-shadow: 0 0 6px #00f5a0; }
`;

// ===== Styled Components =====
const Section = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #081225, #0b132b);
  font-family: "Inter", sans-serif;
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeInUp} 0.8s ease forwards;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const FormCard = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 2.5rem 2rem;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 30px rgba(0, 245, 160, 0.2);
  border: 1px solid rgba(0, 245, 160, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  animation: ${fadeInUp} 1s ease forwards;
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 245, 160, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: 0.3s;

  &:focus {
    border-color: #00f5a0;
    box-shadow: 0 0 10px #00f5a0;
  }
`;

const Button = styled.button`
  padding: 14px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  transition: transform 0.2s, box-shadow 0.3s;
  animation: ${pulseGlow} 3s infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 15px #00f5a0;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 12px;
  }
`;

const FooterText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  color: #aaa;
  animation: ${fadeInUp} 1s ease forwards;

  a {
    color: #00f5a0;
    font-weight: 600;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// ===== Component =====
const Register = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const user = { username: username || email.split("@")[0], email };
    localStorage.setItem("mock_user", JSON.stringify(user));
    login(user);
  };

  return (
    <Section>
      <Title>Create Your Account</Title>
      <FormCard onSubmit={submit}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Create Account</Button>
      </FormCard>
      <FooterText>
        Already have an account? <a href="/login">Log In</a>
      </FooterText>
    </Section>
  );
};

export default Register;
