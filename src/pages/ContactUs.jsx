
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";

// =====================
// Animations
// =====================
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(4deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,245,160,0.4); }
  50% { box-shadow: 0 0 60px rgba(0,245,160,0.7), 0 0 100px rgba(0,217,245,0.5); }
`;

// =====================
// Quantum Logo
// =====================
const QuantumLogo = ({ size = 80 }) => (
  <LogoWrapper size={size}>
    <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="qgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5a0" />
          <stop offset="100%" stopColor="#00d9f5" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" stroke="url(#qgrad)" strokeWidth="3" fill="none" opacity="0.9"/>
      <circle cx="32" cy="32" r="5" fill="#00f5a0"/>
    </svg>
  </LogoWrapper>
);

const LogoWrapper = styled.div`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  animation: ${pulseGlow} 4s infinite ease-in-out;
`;

// =====================
// Floating Particles
// =====================
const Particle = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #00f5a0;
  box-shadow: 0 0 20px #00f5a0;
  top: ${p => p.top}%;
  left: ${p => p.left}%;
  animation: ${float} ${p => 10 + p.delay}s infinite ease-in-out;
`;

// =====================
// Main Component
// =====================
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/contact`, formData);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", description: "" });
      setTimeout(() => setStatus(null), 6000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const particles = [
    { top: 10, left: 20 },
    { top: 30, left: 70 },
    { top: 50, left: 15 },
    { top: 65, left: 80 },
    { top: 80, left: 35 },
    { top: 20, left: 85 },
  ];

  return (
    <PageContainer>
      {particles.map((p, i) => <Particle key={i} {...p} delay={i * 0.7} />)}

      <Content>
        <Header>
          <QuantumLogo size={90} />
          <Title>
            <motion.h1 initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.8 }}>
              Contact Pytro Network
            </motion.h1>
            <motion.p initial={{ y:10, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.3 }}>
              Fill out the form below and our team will respond promptly. <strong>Your message is important to us.</strong>
            </motion.p>
          </Title>
        </Header>

        <FormWrapper as={motion.div} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ type:"spring", stiffness:120 }}>
          <Form onSubmit={handleSubmit}>
            <Grid>
              <Field>
                <Label>Full Name</Label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="your name" required/>
              </Field>
              <Field>
                <Label>Email Address</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required/>
              </Field>
            </Grid>

            <Grid>
              <Field>
                <Label>Phone (Optional)</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Whatsapp"/>
              </Field>
              <Field>
                <Label>Subject</Label>
                <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="General Inquiry" required/>
              </Field>
            </Grid>

            <Field>
              <Label>Your Message</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Write your message..." rows="6" required/>
            </Field>

            <SubmitButton type="submit" disabled={loading} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
              {loading ? "Sending..." : "Send Message"}
            </SubmitButton>

            {status === "success" && <Status success>Message sent successfully! We will respond within 12 hours.</Status>}
            {status === "error" && <Status>Error sending message. Please try again.</Status>}
          </Form>
        </FormWrapper>

        <Footer>© {new Date().getFullYear()} <strong>Pytro Network Pro</strong> — Secure & Fast Blockchain</Footer>
      </Content>
    </PageContainer>
  );
};

export default ContactForm;

// =====================
// Styled Components
// =====================
const PageContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 15% 85%, rgba(0,245,160,0.15), transparent),
              radial-gradient(circle at 85% 15%, rgba(0,217,245,0.15), transparent),
              #050a19;
  color: #d0ffeb;
  position: relative;
  overflow: hidden;
  padding: 60px 20px;
  font-family: 'Inter', sans-serif;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.div`
  h1 {
    font-size: 3.2rem;
    font-weight: 900;
    background: linear-gradient(90deg, #00f5a0, #00d9f5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 12px;
  }
  p {
    font-size: 1.15rem;
    color: #9ee6d1;
    line-height: 1.6;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  background: rgba(10,18,45,0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-bottom: 22px;
  @media(max-width:768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #00f5a0;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0,245,160,0.3);
  background: rgba(15,25,50,0.6);
  color: #bfffe6;
  font-size: 1rem;
  &::placeholder { color: #6ab8a2; opacity: 0.8; }
  &:focus { outline:none; border-color:#00f5a0; box-shadow:0 0 18px rgba(0,245,160,0.3); }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(0,245,160,0.3);
  background: rgba(15,25,50,0.6);
  color: #bfffe6;
  font-size: 1rem;
  resize: none;
  &::placeholder { color: #6ab8a2; opacity: 0.8; }
  &:focus { outline:none; border-color:#00f5a0; box-shadow:0 0 18px rgba(0,245,160,0.3); }
`;

const SubmitButton = styled(motion.button)`
  margin-top: 28px;
  padding: 16px;
  width: 100%;
  font-weight: 700;
  font-size: 1.1rem;
  color: #040b1e;
  background: linear-gradient(135deg,#00f5a0,#00d9f5);
  border: none;
  border-radius: 14px;
  cursor: pointer;
`;

const Status = styled.div`
  margin-top: 20px;
  padding: 14px;
  text-align: center;
  font-weight: 600;
  border-radius: 12px;
  color: ${p => p.success ? "#00f5a0" : "#ff6b6b"};
  background: ${p => p.success ? "rgba(0,245,160,0.15)" : "rgba(255,100,100,0.12)"};
  border: 1px solid ${p => p.success ? "#00f5a0" : "#ff6b6b"};
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 70px;
  font-size: 0.9rem;
  color: #6ab8a2;
`;
