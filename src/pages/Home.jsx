import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

// Global fix – prevent any horizontal overflow
const GlobalWrapper = styled.div`
  width: 100%;
  overflow-x: hidden; /* Critical: removes horizontal scroll */
  box-sizing: border-box;
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e21, #0f162d);
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`;

const Header = styled.header`
  padding: 1rem 5%;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const Logo = styled.div`
  font-size: 1.7rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

const Main = styled.main`
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 5% 4rem;
  width: 100%;
  box-sizing: border-box;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(280px, 340px);
  gap: 2rem;
  align-items: start;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
`;

const Left = styled.div`
  animation: ${fadeInUp} 0.9s ease-out;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 0.8rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 640px) {
    font-size: 2.4rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #b0b8d0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: flex-start;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const Button = styled(Link)`
  padding: 11px 26px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  color: #0b132b;
  border: 2px solid #00f5a0;
  white-space: nowrap;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 245, 160, 0.4);
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 340px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 900px) {
    order: -1;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border-radius: 18px;
  padding: 1.8rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(0, 245, 160, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  width: 100%;
  box-sizing: border-box;

  h2 {
    font-size: 1.4rem;
    color: #00f5a0;
    margin: 0 0 0.5rem;
  }

  p {
    color: #aaa;
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
`;

const CardLogo = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #00f5a0, #00d9f5);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 2.2rem;
  font-weight: 900;
  color: #0b132b;
`;

const KYCPortButton = styled(Link)`
  display: block;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 12px 0;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1rem;
  transition: 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const QuickCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const QuickCard = styled(Link)`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.2rem;
  text-align: center;
  text-decoration: none;
  color: white;
  border: 1px solid rgba(0, 245, 160, 0.15);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    background: rgba(0, 245, 160, 0.15);
    border-color: #00f5a0;
  }

  h3 {
    font-size: 1.1rem;
    color: #00f5a0;
    margin: 0.5rem 0 0.3rem;
  }

  p {
    font-size: 0.85rem;
    color: #b0b8d0;
    margin: 0;
  }
`;

const TokenInfo = styled.div`
  background: rgba(0, 245, 160, 0.08);
  border-radius: 16px;
  padding: 1rem;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #fff;
  width: 100%;
  box-sizing: border-box;

  h4 {
    margin: 0 0 0.5rem;
    color: #00f5a0;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  li {
    margin-bottom: 0.4rem;
  }
`;

const ToggleText = styled.div`
  margin-top: 0.5rem;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #ddd;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1.5rem 5%;
  color: #555;
  font-size: 0.85rem;
  width: 100%;
  box-sizing: border-box;
`;

// Main Component
const Home = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <GlobalWrapper>
      <Container>
        <Header>
          <Logo>Quantum Network</Logo>
        </Header>

        <Main>
          <HeroGrid>
            <Left>
              <Title>Welcome to Quantum Network</Title>
              <Subtitle>
                Next-gen blockchain with mobile-first mining, Trust Circles, ethical staking & privacy-first data.
              </Subtitle>

              <ButtonGroup>
                <Button to="/register">Sign Up</Button>
              </ButtonGroup>

              <QuickCards>
                <QuickCard to="/launchpad">
                  <h3>Launchpad</h3>
                  <p>Fair project launches</p>
                </QuickCard>
                <QuickCard to="/wallet">
                  <h3>Wallet</h3>
                  <p>Check your token balance & supply</p>
                </QuickCard>
                <QuickCard to="/explorer">
                  <h3>Explorer</h3>
                  <p>View blockchain data</p>
                </QuickCard>
              </QuickCards>

              <TokenInfo>
                <h4>Token Distribution (Total Supply: 8,000,000)</h4>
                <ul>
                  <li>Users: 70% (5,600,000)</li>
                  <li>Team: 15% (1,200,000) - locked</li>
                  <li>Advisors: 15% (1,200,000)</li>
                </ul>
              </TokenInfo>
            </Left>

            <RightColumn>
              <LoginCard>
                <CardLogo>Q</CardLogo>
                <h2>Get Started</h2>
                <p>Continue Mining</p>
                <KYCPortButton to="/login">
                  Login Securely
                </KYCPortButton>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                  By continuing you agree to{" "}
                  <span style={{ color: '#00f5a0', cursor: 'pointer' }} onClick={() => setShowTerms(!showTerms)}>
                    Terms
                  </span>{" "} & {" "}
                  <span style={{ color: '#00f5a0', cursor: 'pointer' }} onClick={() => setShowPrivacy(!showPrivacy)}>
                    Privacy
                  </span>
                </p>

                {showTerms && (
                  <ToggleText>
                    <strong>Terms of Service:</strong> By using Quantum Network, you agree to follow our platform rules and guidelines. Misuse of the network may result in suspension or termination of your account.
                  </ToggleText>
                )}

                {showPrivacy && (
                  <ToggleText>
                    <strong>Privacy Policy:</strong> We respect your privacy and only use your data to provide services. Your personal information is securely stored and never shared without consent.
                  </ToggleText>
                )}
              </LoginCard>
            </RightColumn>
          </HeroGrid>
        </Main>

        <Footer>
          © {new Date().getFullYear()} Quantum Network. All rights reserved.
        </Footer>
      </Container>
    </GlobalWrapper>
  );
};

export default Home;