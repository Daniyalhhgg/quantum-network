import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.section`
  padding: 40px 20px;
  max-width: 900px;
  margin: auto;
  color: #fff;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-radius: 16px;
  animation: ${fadeIn} 0.6s ease;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 10px;
  color: #38bdf8;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 30px;
  color: #cbd5e1;
`;

const Button = styled.button`
  display: block;
  margin: 0 auto 30px;
  padding: 12px 30px;
  font-size: 1rem;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    transform: translateY(-2px);
  }
`;

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
`;

const PartnerCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease;
  h4 {
    color: #38bdf8;
    margin-bottom: 8px;
  }
  p {
    color: #cbd5e1;
    font-size: 0.95rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #1e293b;
  padding: 30px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${fadeIn} 0.4s ease;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  h3 {
    color: #38bdf8;
    margin-bottom: 16px;
  }
  p {
    color: #cbd5e1;
    margin-bottom: 20px;
  }
`;

const ModalButton = styled(Button)`
  width: 45%;
  margin: 10px;
  font-size: 0.9rem;
  padding: 10px;
`;

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
      <Subtitle>
        Sell anonymized engagement data to trusted partners and earn QNT tokens.
      </Subtitle>

      <Button onClick={() => setShowConsent(true)}>
        {opted ? "Manage Consent" : "Opt-in to Marketplace"}
      </Button>

      {showConsent && (
        <ModalOverlay>
          <Modal>
            <h3>Data Consent</h3>
            <p>
              By opting in, you allow the sharing of *anonymized* engagement data
              with trusted research & ad partners. You can revoke at any time.
            </p>
            <div>
              <ModalButton onClick={() => handleOpt(true)}>Agree</ModalButton>
              <ModalButton onClick={() => handleOpt(false)}>Cancel</ModalButton>
            </div>
          </Modal>
        </ModalOverlay>
      )}

      <h3 style={{ color: "#38bdf8", margin: "20px 0 10px" }}>Partners</h3>
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
