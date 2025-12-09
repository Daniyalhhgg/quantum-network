import React, { useContext, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

// ====== ANIMATIONS ======
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(0, 245, 160, 0.4); }
  50% { box-shadow: 0 0 30px rgba(0, 245, 160, .9); }
`;

const modalPop = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
`;

// ====== STYLED COMPONENTS ======
const Section = styled.section`
  min-height: 100vh;
  background: radial-gradient(circle at 20% 80%, #0a0e1f, #050812);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-family: "Inter", -apple-system, sans-serif;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0.5rem;
    padding-top: 50px;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
    padding-top: 40px;
  }
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 6vw, 3.2rem);
  font-weight: 900;
  text-align: center;
  background: linear-gradient(90deg, #00f5a0, #00d9f5, #8a2be2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.9s ease-out;
  padding: 0 0.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.3rem, 7vw, 2rem);
    margin-bottom: 1rem;
  }
`;

const FormCard = styled.form`
  background: rgba(15, 25, 50, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 245, 160, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: ${fadeInUp} 1s ease-out;
  z-index: 10;
  box-sizing: border-box;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.2rem;
    max-width: 94%;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    max-width: 96%;
    border-radius: 12px;
    margin: 0 0.2rem;
  }
`;

const InputGroup = styled.div`
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
    opacity: 0.8;
    font-size: 0.9rem;
  }
  
  &:focus {
    border-color: #00f5a0;
    box-shadow: 0 0 20px rgba(0, 245, 160, 0.4);
  }

  @media (max-width: 768px) {
    padding: 13px 15px;
    font-size: 0.95rem;
    border-radius: 9px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    font-size: 0.9rem;
    border-radius: 8px;
  }

  @media (max-width: 360px) {
    padding: 11px 13px;
    font-size: 0.85rem;
  }
`;

const Label = styled.label`
  position: absolute;
  left: 14px;
  top: -9px;
  background: #0a0e1f;
  padding: 0 8px;
  font-size: 0.85rem;
  color: #00f5a0;
  font-weight: 600;
  pointer-events: none;
  z-index: 2;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    left: 12px;
    padding: 0 6px;
    top: -8px;
  }

  @media (max-width: 360px) {
    font-size: 0.75rem;
    top: -7px;
  }
`;

const ReferralBox = styled.div`
  background: rgba(0, 245, 160, 0.15);
  border: 2px dashed #00f5a0;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  color: #00f5a0;
  font-weight: 700;
  font-size: 1rem;
  margin: 1.2rem 0;
  animation: ${pulse} 3s infinite;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.95rem;
    margin: 1rem 0;
    border-radius: 10px;
  }

  @media (max-width: 360px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 0.8rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 245, 160, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 1rem;
    margin-top: 0.7rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 13px;
    font-size: 0.95rem;
    margin-top: 0.6rem;
    border-radius: 9px;
  }

  @media (max-width: 360px) {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const Footer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  color: #aab;
  font-size: 0.95rem;
  width: 100%;
  max-width: 400px;
  padding: 0 1rem;
  box-sizing: border-box;
  line-height: 1.6;

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

// ====== SUCCESS MODAL ======
const SuccessModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(5, 8, 18, 0.96);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0.5rem;

  @media (max-width: 480px) {
    padding: 0.3rem;
  }
`;

const ModalContent = styled.div`
  background: rgba(15, 25, 50, 0.92);
  border: 2px solid #00f5a0;
  border-radius: 18px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  max-width: 360px;
  width: 90%;
  animation: ${modalPop} 0.7s ease-out;
  box-shadow: 0 0 60px rgba(0, 245, 160, 0.7);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 2rem 1.2rem;
    border-radius: 16px;
    max-width: 85%;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 14px;
    max-width: 90%;
  }

  @media (max-width: 360px) {
    padding: 1.2rem 0.8rem;
    max-width: 95%;
  }
`;

const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: conic-gradient(#00f5a0, #00d9f5, #8a2be2, #00f5a0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #000;
  animation: ${pulse} 2s infinite;

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 2.5rem;
    margin-bottom: 1.2rem;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 360px) {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.8rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }

  @media (max-width: 360px) {
    font-size: 1.4rem;
  }
`;

const SuccessMessage = styled.p`
  color: #e0fff5;
  font-size: 1.1rem;
  margin: 0.5rem 0 1.5rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0.4rem 0 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin: 0.3rem 0 1rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 360px) {
    font-size: 0.9rem;
  }
`;

const Confetti = styled.div`
  position: absolute;
  width: 8px;
  height: 16px;
  background: ${p => p.color};
  animation: ${confettiFall} ${p => p.duration}s linear forwards;
  left: ${p => p.left}%;
  top: -30px;
  border-radius: 2px;

  @media (max-width: 480px) {
    width: 6px;
    height: 12px;
  }

  @media (max-width: 360px) {
    width: 5px;
    height: 10px;
  }
`;

// ====== MAIN COMPONENT ======
const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // API URL - works in local + production
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  // Auto-fill referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm(prev => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "referralCode") {
      setForm(prev => ({ ...prev, referralCode: value.toUpperCase() }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      alert("Please fill all required fields");
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

      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Success
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      login(data.user);
      setUserName(data.user.name || data.user.email.split("@")[0]);
      setShowSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 3000);

    } catch (err) {
      alert(err.message || "Something went wrong. Try again.");
      setLoading(false);
    }
  };

  // Confetti - reduced for mobile performance
  const confettiColors = ["#00f5a0", "#00d9f5", "#8a2be2", "#ff6b6b", "#ffd93d"];
  const confettis = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    left: Math.random() * 100,
    duration: 2.5 + Math.random() * 2.5,
  }));

  return (
    <>
      <Section>
        <Title>Join Pytro Network</Title>

        <FormCard onSubmit={handleSubmit}>
          <InputGroup>
            <Input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              value={form.name} 
              onChange={handleChange} 
              required 
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
              required 
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
              required
              minLength="6"
            />
            <Label>Password (min 6 chars)</Label>
          </InputGroup>

          {/* Referral Code - Auto or Manual */}
          {form.referralCode ? (
            <ReferralBox>
              Referred by: <strong>{form.referralCode}</strong>
              <br />
              <small>Bonus rewards unlocked!</small>
            </ReferralBox>
          ) : (
            <InputGroup>
              <Input
                type="text"
                placeholder="Referral Code (optional)"
                value={form.referralCode}
                onChange={handleChange}
                name="referralCode"
              />
              <Label>Referral Code (optional)</Label>
            </InputGroup>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account Free"}
          </SubmitButton>
        </FormCard>

        <Footer>
          Already have an account? <Link to="/login">Log In Here</Link>
        </Footer>
      </Section>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <SuccessModal>
          {confettis.map(c => (
            <Confetti 
              key={c.id} 
              color={c.color} 
              left={c.left} 
              duration={c.duration} 
            />
          ))}
          <ModalContent>
            <CheckIcon>✓</CheckIcon>
            <SuccessTitle>Welcome!</SuccessTitle>
            <SuccessMessage>
              Welcome to Quantum,<br />
              <strong>{userName}!</strong>
            </SuccessMessage>
            <div style={{ 
              color: "#88ddcc", 
              fontSize: "0.9rem",
              marginTop: "0.5rem" 
            }}>
              Redirecting to dashboard...
            </div>
          </ModalContent>
        </SuccessModal>
      )}
    </>
  );
};

export default Register;