import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

// ===== Animations =====
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px #00f5a0; }
  50% { box-shadow: 0 0 18px #00d9f5; }
  100% { box-shadow: 0 0 5px #00f5a0; }
`;

// ===== Styled Components =====
const Page = styled.section`
  min-height: 100vh;
  padding: 3rem 1.5rem;
  max-width: 1100px;
  margin: auto;
  color: #fff;
  font-family: "Inter", sans-serif;
  background: radial-gradient(circle at top, #081225, #0b132b);
  animation: ${fadeInUp} 0.6s ease;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5, #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #aaa;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  display: inline-block;
  margin: 0 auto 2rem;
  padding: 12px 28px;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  color: #0b132b;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  transition: all 0.3s ease;
  animation: ${glowPulse} 3s infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px #00f5a0;
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.95rem;
  }
`;

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const PartnerCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(0, 245, 160, 0.2);
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 20px #00f5a0;
  }

  h4 {
    color: #00f5a0;
    margin-bottom: 8px;
  }

  p {
    color: #ccc;
    font-size: 0.95rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: rgba(11,19,43,0.95);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  animation: ${fadeInUp} 0.4s ease;
  border: 1px solid #00f5a0;
  box-shadow: 0 0 20px rgba(0,245,160,0.3);

  h3 {
    color: #00f5a0;
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }

  p {
    color: #ccc;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
`;

const ModalButton = styled(Button)`
  width: 45%;
  margin: 0.5rem;
  font-size: 0.9rem;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// ===== Component =====
const Marketplace = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [opted, setOpted] = useState(false);

  const partners = [
    { id: 1, name: "AdPartner", desc: "Audience insights (aggregated)" },
    { id: 2, name: "ResearchCo", desc: "Anonymized engagement data" },
    { id: 3, name: "MarketAI", desc: "Trend-based behavioral analytics" },
  ];

  const handleOpt = (yes) => {
    setOpted(yes);
    setShowConsent(false);
    if (yes) alert("✅ You have opted into the Quantum Data Marketplace!");
  };

  return (
    <Page>
      <Title>🌐 Quantum Data Marketplace</Title>
      <Subtitle>Sell anonymized engagement data to trusted partners and earn QNT tokens.</Subtitle>

      <Button onClick={() => setShowConsent(true)}>
        {opted ? "Manage Consent" : "Opt-in to Marketplace"}
      </Button>

      {showConsent && (
        <ModalOverlay>
          <Modal>
            <h3>Data Consent</h3>
            <p>
              By opting in, you allow the sharing of *anonymized* engagement data
              with trusted partners. You can revoke consent at any time.
            </p>
            <div>
              <ModalButton onClick={() => handleOpt(true)}>Agree</ModalButton>
              <ModalButton onClick={() => handleOpt(false)}>Cancel</ModalButton>
            </div>
          </Modal>
        </ModalOverlay>
      )}

      <h3 style={{ color: "#00f5a0", margin: "2rem 0 1rem", textAlign: "center" }}>Partners</h3>
      <PartnersGrid>
        {partners.map((p) => (
          <PartnerCard key={p.id}>
            <h4>{p.name}</h4>
            <p>{p.desc}</p>
          </PartnerCard>
        ))}
      </PartnersGrid>
    </Page>
  );
};

export default Marketplace;
