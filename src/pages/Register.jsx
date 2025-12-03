import React, { useContext, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// ===== ANIMATIONS =====
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

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

// ===== STYLED COMPONENTS =====
const Section = styled.section`
  min-height: 100vh;
  background: radial-gradient(circle at 20% 80%, #0a0e1f, #050812);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;
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
  z-index: 10;
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
  transition: all 0.3s ease;

  &::placeholder { color: #88aabb; }
  &:focus { border-color: #00f5a0; box-shadow: 0 0 15px rgba(0, 245, 160, 0.4); }
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

const ReferralBox = styled.div`
  background: rgba(0, 245, 160, 0.15);
  border: 1px dashed #00f5a0;
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  color: #00f5a0;
  font-size: 0.95rem;
  margin: 1rem 0;
  animation: ${pulse} 3s infinite;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${pulse} 4s infinite;

  &:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0, 245, 160, 0.5); }
  &:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #99aabb;
  font-size: 0.95rem;
  z-index: 10;

  a { color: #00f5a0; font-weight: 700; text-decoration: none; }
`;

// ========= SUCCESS MODAL =========
const SuccessModal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(5, 8, 18, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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
  font-size: 3.2rem;
  color: #000;
`;

const SuccessTitle = styled.h2`
  font-size: 2.3rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SuccessMessage = styled.p`
  color: #bfffe6;
  font-size: 1.15rem;
`;

// ===== MAIN COMPONENT =====
const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  // Auto-referral from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm(prev => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============= REGISTER API CALL =============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            ref: form.referralCode || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed!");
        setLoading(false);
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      login(data.user);

      setUserName(data.user.name);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2800);

    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Section>
        <Title>Join Quantum Network</Title>

        <FormCard onSubmit={handleSubmit}>
          <InputGroup>
            <Input type="text" name="name" placeholder="Full Name"
              value={form.name} onChange={handleChange} required />
            <Label>Full Name</Label>
          </InputGroup>

          <InputGroup>
            <Input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
            <Label>Email Address</Label>
          </InputGroup>

          <InputGroup>
            <Input type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required minLength="6" />
            <Label>Password (min 6 chars)</Label>
          </InputGroup>

          {!form.referralCode ? (
            <InputGroup>
              <Input
                type="text"
                placeholder="Referral Code (optional)"
                value={form.referralCode}
                onChange={(e) =>
                  setForm({ ...form, referralCode: e.target.value.toUpperCase() })
                }
              />
              <Label>Referral Code</Label>
            </InputGroup>
          ) : (
            <ReferralBox>
              Referred by: <strong>{form.referralCode}</strong>
              <br />
              <small>You’ll get signup bonus!</small>
            </ReferralBox>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account Free"}
          </SubmitButton>
        </FormCard>

        <Footer>
          Already have an account? <a href="/login">Log In Here</a>
        </Footer>
      </Section>

      {showSuccess && (
        <SuccessModal>
          <ModalContent>
            <CheckIcon>✓</CheckIcon>
            <SuccessTitle>Account Created!</SuccessTitle>
            <SuccessMessage>
              Welcome to Quantum Network,<br />
              <strong>{userName}</strong>!
            </SuccessMessage>
            <div style={{ color: "#88aabb", marginTop: "1rem" }}>
              Redirecting to dashboard...
            </div>
          </ModalContent>
        </SuccessModal>
      )}
    </>
  );
};

export default Register;
