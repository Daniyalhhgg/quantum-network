// ==== Dashboard.js ====
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ===== Styled Components =====
const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #0b1224, #060b16 80%);
  color: #e6f1ff;
  padding: 1rem clamp(0.5rem, 2vw, 2rem) 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    padding-bottom: 6rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.4rem 7rem;
  }
`;

const Header = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(1rem, 3vw, 2rem);
  padding: clamp(0.8rem, 2vw, 1.2rem);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 245, 160, 0.08);
  box-shadow: 0 0 40px rgba(0, 245, 160, 0.08);
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const Title = styled.h1`
  font-size: clamp(1.3rem, 2.5vw, 2rem);
  font-weight: 800;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
  }
`;

const Balance = styled.div`
  font-size: clamp(1rem, 1.8vw, 1.3rem);
  font-weight: 700;
  color: #bfffe6;
  text-align: right;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const Grid = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: clamp(0.8rem, 2vw, 1.2rem);
  margin-bottom: 6rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: clamp(1rem, 2vw, 1.3rem);
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 25px rgba(0, 245, 160, 0.15);
  }
`;

const CardTitle = styled.div`
  color: #00f5a0;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
`;

const CardValue = styled.div`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 800;
  margin-bottom: 0.4rem;
`;

const SecondaryText = styled.div`
  color: #9fb7c7;
  font-size: clamp(0.85rem, 1vw, 0.95rem);
  line-height: 1.4;
  margin-bottom: 0.8rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.8rem;
  justify-content: center;
`;

const NeonButton = styled(motion.button)`
  padding: clamp(0.45rem, 1vw, 0.6rem) clamp(0.8rem, 2vw, 1rem);
  border-radius: 8px;
  border: 1px solid #00f5a0;
  background: transparent;
  color: #00f5a0;
  font-weight: 600;
  font-size: clamp(0.75rem, 1vw, 0.9rem);
  cursor: pointer;
  transition: all 0.15s ease;
  flex: 1 1 45%;
  min-width: 80px;

  &:hover {
    background: #00f5a0;
    color: #05101a;
    box-shadow: 0 0 14px rgba(0, 245, 160, 0.5);
  }
`;

// ===== Fixed Bottom Floating Panel (centered on all screens) =====
const BottomBox = styled(motion.div)`
  position: fixed;
  left: 0%;
  bottom: 16px;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  padding: clamp(0.6rem, 1.5vw, 1rem);
  border-radius: 14px;
  background: rgba(0, 12, 30, 0.95);
  border: 1px solid rgba(0, 245, 160, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.4rem, 1vw, 0.7rem);
  backdrop-filter: blur(12px);
  box-shadow: 0 6px 20px rgba(0, 245, 160, 0.25);
  z-index: 100;

  @media (max-width: 768px) {
    bottom: 14px;
    width: 92%;
    max-width: 420px;
  }

  @media (max-width: 480px) {
    bottom: 12px;
    width: 95%;
    max-width: 360px;
  }

  @media (min-width: 1024px) {
    bottom: 24px;
    max-width: 480px;
  }
`;

const PillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(0.3rem, 1vw, 0.6rem);
  width: 100%;
`;

const Pill = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 245, 160, 0.15);
  border-radius: 8px;
  padding: clamp(0.35rem, 1vw, 0.6rem) clamp(0.6rem, 1vw, 0.8rem);
  flex: 1;
  text-align: center;
  min-width: 75px;
  font-size: clamp(0.7rem, 1vw, 0.85rem);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 10px rgba(0, 245, 160, 0.3);
  }
`;

const PillTitle = styled.div`
  color: #9fb7c7;
  font-size: clamp(0.65rem, 0.9vw, 0.75rem);
`;

const PillValue = styled.div`
  font-weight: 700;
  color: #bfffe6;
  font-size: clamp(0.75rem, 1vw, 0.9rem);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.3rem, 1vw, 0.6rem);
  justify-content: center;
  width: 100%;
`;

const ActionButton = styled(NeonButton)`
  flex: 1 1 45%;
  min-width: 90px;
`;

// ===== Dashboard Component =====
const Dashboard = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(parseFloat(localStorage.getItem("balance") || "0"));
  const [pending, setPending] = useState(parseFloat(localStorage.getItem("pendingBalance") || "0"));
  const [isMining, setIsMining] = useState(JSON.parse(localStorage.getItem("isMining") || "false"));
  const [lastClaimTime, setLastClaimTime] = useState(parseInt(localStorage.getItem("lastClaimTime") || "0"));
  const [countdown, setCountdown] = useState("");
  const [referrals, setReferrals] = useState(JSON.parse(localStorage.getItem("referrals") || "[]"));
  const [kycStatus, setKycStatus] = useState(localStorage.getItem("kycStatus") || "not_submitted");

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMining && lastClaimTime) {
        const now = Date.now();
        const diff = 24 * 60 * 60 * 1000 - (now - lastClaimTime);
        if (diff <= 0) {
          setCountdown("Ready!");
          setIsMining(false);
          localStorage.setItem("isMining", "false");
        } else {
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff / (1000 * 60)) % 60);
          const secs = Math.floor((diff / 1000) % 60);
          setCountdown(`${hrs}h ${mins}m ${secs}s`);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isMining, lastClaimTime]);

  useEffect(() => {
    const storedKyc = localStorage.getItem("kycStatus");
    if (storedKyc) setKycStatus(storedKyc);

    if (storedKyc === "approved" && pending > 0) {
      const total = balance + pending;
      setBalance(total);
      setPending(0);
      localStorage.setItem("balance", total.toString());
      localStorage.setItem("pendingBalance", "0");

      const storedRefs = JSON.parse(localStorage.getItem("referrals") || "[]");
      setReferrals(storedRefs);

      alert(`✅ ${pending} pending tokens moved to wallet after KYC approval.`);
    }
  }, [kycStatus, pending, balance]);

  const startMining = () => {
    setIsMining(true);
    setLastClaimTime(Date.now());
    localStorage.setItem("isMining", "true");
    localStorage.setItem("lastClaimTime", Date.now().toString());
  };

  const claimReward = () => {
    const now = Date.now();
    const diff = now - lastClaimTime;
    if (diff >= 24 * 60 * 60 * 1000) {
      if (kycStatus !== "approved") {
        const newPending = pending + 1;
        setPending(newPending);
        localStorage.setItem("pendingBalance", newPending.toString());
        alert("⏳ KYC not approved. Reward stored as pending.");
      } else {
        const newBalance = balance + 1;
        setBalance(newBalance);
        localStorage.setItem("balance", newBalance.toString());
        alert("🎉 You claimed 1 token!");
      }
      setLastClaimTime(now);
      localStorage.setItem("lastClaimTime", now.toString());
    } else {
      alert("⏳ 24 hours not completed yet!");
    }
  };

  const addReferral = (level = 1) => {
    let reward = level === 1 ? 10 : level === 2 ? 9 : 7;
    if (kycStatus !== "approved") {
      const newPending = pending + reward;
      setPending(newPending);
      localStorage.setItem("pendingBalance", newPending.toString());
      alert(`🎁 Referral added! ${reward} tokens pending KYC approval.`);
      return;
    }

    const newRefs = [...referrals, { level, reward }];
    const newBalance = balance + reward;

    setReferrals(newRefs);
    setBalance(newBalance);
    localStorage.setItem("referrals", JSON.stringify(newRefs));
    localStorage.setItem("balance", newBalance.toString());
    alert(`🎁 Referral added! Level ${level} reward: ${reward} tokens`);
  };

  return (
    <Page>
      <Header initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Title>Quantum Dashboard ⚡</Title>
        <Balance>{balance.toFixed(3)} QNT</Balance>
      </Header>

      <Grid>
        {/* Mining */}
        <Card initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <CardTitle>Mining</CardTitle>
          <CardValue>{isMining ? "Running" : "Stopped"}</CardValue>
          <SecondaryText>Earn 1 QNT every 24 hours of mining.</SecondaryText>
          <ButtonGroup>
            {!isMining && <NeonButton onClick={startMining}>Start Mining</NeonButton>}
            {isMining && (
              <NeonButton onClick={claimReward}>{countdown === "Ready!" ? "Claim Reward" : countdown}</NeonButton>
            )}
          </ButtonGroup>
        </Card>

        {/* Referral */}
        <Card initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CardTitle>Referral Program</CardTitle>
          <SecondaryText>
            Level 1 → 10 QNT <br />
            Level 2 → 9 QNT <br />
            Level 3 → 7 QNT
          </SecondaryText>
          <ButtonGroup>
            <NeonButton onClick={() => addReferral(1)}>Level 1</NeonButton>
            <NeonButton onClick={() => addReferral(2)}>Level 2</NeonButton>
            <NeonButton onClick={() => addReferral(3)}>Level 3</NeonButton>
          </ButtonGroup>
        </Card>

        {/* KYC */}
        <Card>
          <CardTitle>KYC Status</CardTitle>
          <CardValue
            style={{
              color:
                kycStatus === "approved"
                  ? "#00f5a0"
                  : kycStatus === "pending"
                  ? "#ffc107"
                  : "#ff6b6b",
            }}
          >
            {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
          </CardValue>
          <NeonButton onClick={() => navigate("/kyc")}>
            {kycStatus === "approved" ? "View KYC" : "Complete KYC"}
          </NeonButton>
        </Card>

        {/* Referral Stats */}
        <Card>
          <CardTitle>Referral Stats</CardTitle>
          <CardValue>{referrals.length} Joined</CardValue>
          <SecondaryText>
            Total Earned: {referrals.reduce((a, r) => a + (r.reward || 0), 0)} QNT
          </SecondaryText>
        </Card>
      </Grid>

      {/* Bottom Floating Panel */}
      <BottomBox initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
        <PillContainer>
          <Pill>
            <PillTitle>Status</PillTitle>
            <PillValue>{isMining ? "Mining" : "Idle"}</PillValue>
          </Pill>
          <Pill>
            <PillTitle>Claim Time</PillTitle>
            <PillValue>{countdown || "Not started"}</PillValue>
          </Pill>
          <Pill>
            <PillTitle>Pending</PillTitle>
            <PillValue>{pending.toFixed(3)}</PillValue>
          </Pill>
          <Pill>
            <PillTitle>KYC</PillTitle>
            <PillValue>
              {kycStatus === "approved" ? "✓" : kycStatus === "pending" ? "⏳" : "✗"}
            </PillValue>
          </Pill>
        </PillContainer>

        <Actions>
          <ActionButton onClick={() => navigate("/wallet", { state: { openSendModal: true } })}>
            ➤ Send
          </ActionButton>
          <ActionButton onClick={() => navigate("/wallet")}>⇣ Receive</ActionButton>
        </Actions>
      </BottomBox>
    </Page>
  );
};

export default Dashboard;
