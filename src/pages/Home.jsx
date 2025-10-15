import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// ===== Animations =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// ===== Styled Components =====
const Section = styled.section`
  font-family: "Poppins", sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Hero = styled.div`
  max-width: 900px;
  animation: ${fadeIn} 1s ease forwards;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #00d4ff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #e0e0e0;
  margin-bottom: 30px;
  line-height: 1.6;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTA = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  background: ${(props) => (props.ghost ? "transparent" : "linear-gradient(90deg,#00d4ff,#00ff88)")};
  color: ${(props) => (props.ghost ? "#00ff88" : "#0f2027")};
  border: 2px solid #00ff88;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  animation: ${pulse} 3s infinite;

  &:hover {
    background: #00ff88;
    color: #0f2027;
    transform: translateY(-3px);
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 80px;
  width: 100%;
  max-width: 1000px;
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, background 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 1.5s ease forwards;

  &:hover {
    transform: translateY(-8px);
    background: rgba(0, 255, 136, 0.1);
  }

  h3 {
    color: #00ff88;
    margin-bottom: 10px;
    font-size: 1.3rem;
  }

  p {
    color: #d4d4d4;
    line-height: 1.5;
  }
`;

const Footer = styled.footer`
  margin-top: 80px;
  color: #aaa;
  font-size: 0.9rem;
  text-align: center;
`;

// ===== Component =====
const Home = () => {
  return (
    <Section>
      <Hero>
        <Title>Quantum Network</Title>
        <Subtitle>
          TrustCircle — mobile-friendly Proof-of-Engagement mining + ethical staking.
        </Subtitle>
        <CTA>
          <Button to="/register">Get Started</Button>
          <Button to="/dashboard" ghost>
            Try Demo
          </Button>
        </CTA>
      </Hero>

      <Features>
        <Feature>
          <h3>Low-energy Mining</h3>
          <p>Proof-of-Engagement (PoE) — battery-friendly events.</p>
        </Feature>
        <Feature>
          <h3>TrustCircles</h3>
          <p>Create small verified groups to boost rewards & trust.</p>
        </Feature>
        <Feature>
          <h3>Data Marketplace</h3>
          <p>Opt-in to monetize your engagement data securely.</p>
        </Feature>
      </Features>

      <Footer>© {new Date().getFullYear()} Quantum Network. All rights reserved.</Footer>
    </Section>
  );
};

export default Home;
