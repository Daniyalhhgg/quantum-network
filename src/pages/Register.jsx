
import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";

// ===== Animations =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

// ===== Styled Components =====
const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  font-family: "Poppins", sans-serif;
  color: #fff;
  padding: 40px 20px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #00d4ff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  animation: ${fadeIn} 1s ease forwards;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 20px rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 1s ease forwards;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  color: #0f2027;
  outline: none;
  background: #fff;
  transition: box-shadow 0.3s ease;

  &:focus {
    box-shadow: 0 0 10px #00ff88;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #0f2027;
  background: linear-gradient(90deg, #00d4ff, #00ff88);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${pulse} 3s infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 15px #00ff88;
  }
`;

const FooterText = styled.p`
  margin-top: 20px;
  color: #ccc;
  font-size: 0.95rem;
  text-align: center;
  animation: ${fadeIn} 1s ease forwards;

  a {
    color: #00ff88;
    text-decoration: none;
    font-weight: 600;
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

  const submit = (e) => {
    e.preventDefault();
    const user = { username: username || email.split("@")[0], email };
    localStorage.setItem("mock_user", JSON.stringify(user));
    login(user);
  };

  return (
    <Section>
      <Title>Create Your Account</Title>
      <Form onSubmit={submit}>
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
        <Input type="password" placeholder="Password" required />
        <Button type="submit">Create Account</Button>
      </Form>
      <FooterText>
        Already have an account? <a href="/login">Log In</a>
      </FooterText>
    </Section>
  );
};

export default Register;
