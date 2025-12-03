import React, { useContext, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// ====== Animations ======
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(0, 245, 160, 0.4); }
  50% { box-shadow: 0 0 30px rgba(0, 245, 160, 0.9); }
`;

const modalPop = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

// ===== Styled Components =====
const Section = styled.section`
  min-height: 100vh;
  background: radial-gradient(circle at 20% 80%, #0a0e1f, #050812);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  text-align: center;
  background: linear-gradient(90deg, #00f5a0, #00d9f5, #8a2be2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.9s ease-out;
`;

const FormCard = styled.form`
  background: rgba(15, 25, 50, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 245, 160, 0.3);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  animation: ${fadeInUp} 1s ease-out;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 245, 160, 0.4);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 1rem;
  outline: none;
`;

const Label = styled.label`
  position: absolute;
  left: 16px;
  top: -10px;
  background: #0a0e1f;
  padding: 0 8px;
  font-size: 0.85rem;
  color: #00f5a0;
  font-weight: 600;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #99aabb;
`;

// ========== MAIN COMPONENT ==========
const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ***** FINAL API URL FIXED *****
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
  });

  const [loading, setLoading] = useState(false);

  // Read ref code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm((p) => ({ ...p, referralCode: ref.toUpperCase() }));
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============= SUBMIT =============
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          ref: form.referralCode || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      login(data.user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <Title>Create Your Account</Title>

      <FormCard onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <Label>Full Name</Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <Label>Email Address</Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
          <Label>Password</Label>
        </InputGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </SubmitButton>
      </FormCard>

      <Footer>
        Already have an account? <a href="/login">Login</a>
      </Footer>
    </Section>
  );
};

export default Register;
