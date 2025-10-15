import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// ===== Animations =====
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 6px #00f5a0; }
  50% { box-shadow: 0 0 20px #00d9f5; }
`;

// ===== Styled Components =====
const Section = styled.section`
  font-family: "Inter", sans-serif;
  color: #fff;
  background: radial-gradient(circle at top, #081225, #0b132b);
  min-height: 100vh;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Hero = styled.div`
  max-width: 900px;
  animation: ${fadeInUp} 1s ease forwards;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 2rem;
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
  background: ${(props) =>
    props.ghost ? "transparent" : "linear-gradient(90deg,#00f5a0,#00d9f5)"};
  color: ${(props) => (props.ghost ? "#00f5a0" : "#0b132b")};
  border: 2px solid #00f5a0;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  animation: ${pulseGlow} 3s infinite;

  &:hover {
    background: #00f5a0;
    color: #0b132b;
    transform: translateY(-3px);
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 6rem;
  width: 100%;
  max-width: 1000px;
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(15px);
  transition: transform 0.3s ease, background 0.3s ease;
  border: 1px solid rgba(0, 245, 160, 0.2);
  animation: ${fadeInUp} 1.5s ease forwards;

  &:hover {
    transform: translateY(-8px);
    background: rgba(0, 245, 160, 0.1);
  }

  h3 {
    color: #00f5a0;
    margin-bottom: 0.8rem;
    font-size: 1.3rem;
  }

  p {
    color: #ccc;
    line-height: 1.5;
  }
`;

const Footer = styled.footer`
  margin-top: 6rem;
  color: #888;
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
