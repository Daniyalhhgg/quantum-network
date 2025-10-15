import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { CircleContext } from "../context/CircleContext";
import CreateCircleModal from "../components/trustcircle/CreateCircleModal";

// ===== Animations =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 6px #00f5a0; }
  50% { box-shadow: 0 0 22px #00f5a0; }
  100% { box-shadow: 0 0 6px #00f5a0; }
`;

// ===== Styled Components =====
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #0a0f1e, #111827, #000);
  color: #e0e6f5;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.8s ease;

  @media (max-width: 600px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(90deg, #00f5a0, #00d9f5, #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

const Section = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(0, 245, 160, 0.3);
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 245, 160, 0.15);

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const SectionHeader = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #00f5a0;

  @media (max-width: 600px) {
    font-size: 1.1rem;
    text-align: center;
  }
`;

const CircleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.8rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const CircleCard = styled(motion.div)`
  background: rgba(28, 37, 65, 0.9);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 245, 160, 0.4);
  animation: ${pulseGlow} 3s infinite ease-in-out;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const CircleName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const MembersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
`;

const MemberAvatar = styled.div`
  width: 45px;
  height: 45px;
  background: rgba(0, 245, 160, 0.1);
  border: 2px solid #00f5a0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f5a0;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 245, 160, 0.3);
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    width: 35px;
    height: 35px;
    font-size: 0.85rem;
  }
`;

const AttestButton = styled(motion.button)`
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  color: #0b132b;
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: auto;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 0 15px #00f5a0;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 0.6rem 0.8rem;
  }
`;

// ===== Main Component =====
const TrustCircle = () => {
  const { circles, createCircle, attestToCircle } = useContext(CircleContext);

  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌐 TrustCircle Management
      </Title>

      {/* Create Circle Section */}
      <Section>
        <SectionHeader>Create a New Circle</SectionHeader>
        <CreateCircleModal onCreate={createCircle} />
      </Section>

      {/* Circles List Section */}
      <Section>
        <SectionHeader>Your Circles</SectionHeader>

        {circles.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No circles yet — start by creating one.
          </p>
        ) : (
          <CircleGrid>
            {circles.map((circle) => (
              <CircleCard
                key={circle.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <CircleName>{circle.name}</CircleName>
                <MembersList>
                  {circle.members.map((m, idx) => (
                    <MemberAvatar key={idx}>
                      {m.username?.[0]?.toUpperCase() || "U"}
                    </MemberAvatar>
                  ))}
                </MembersList>
                <AttestButton
                  whileTap={{ scale: 0.95 }}
                  onClick={() => attestToCircle(circle.id)}
                >
                  🔏 Attest
                </AttestButton>
              </CircleCard>
            ))}
          </CircleGrid>
        )}
      </Section>
    </Container>
  );
};

export default TrustCircle;
