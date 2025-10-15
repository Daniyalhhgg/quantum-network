import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ===== Styled Components =====
const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #0b1224, #060b16 80%);
  color: #e6f1ff;
  padding: 2rem 1rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
`;

const Header = styled(motion.div)`
  width: 100%;
  max-width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.2rem 1.5rem;
  border-radius: 18px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 245, 160, 0.08);
  box-shadow: 0 0 40px rgba(0, 245, 160, 0.08);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Balance = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #bfffe6;
`;

const Grid = styled.div`
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.2rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(0, 245, 160, 0.15);
  }
`;

const CardTitle = styled.div`
  color: #00f5a0;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CardValue = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
`;

const SecondaryText = styled.div`
  color: #9fb7c7;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const NeonButton = styled(motion.button)`
  margin-top: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #00f5a0;
  background: transparent;
  color: #00f5a0;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: all 0.15s ease;
  &:hover {
    background: #00f5a0;
    color: #05101a;
    box-shadow: 0 0 14px rgba(0, 245, 160, 0.5);
  }
`;

// ===== Footer (Compact Version) =====
const BottomBox = styled(motion.div)`
  position: fixed;
  left: 40%;
  bottom: 12px;
  transform: translateX(-50%);
  width: min(700px, 90%);
  max-width: 700px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(0, 12, 30, 0.95);
  border: 1px solid rgba(0, 245, 160, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(12px);
  box-shadow: 0 6px 20px rgba(0, 245, 160, 0.25);
  z-index: 60;

  @media (max-width: 600px) {
    width: 95%;
    padding: 8px 10px;
  }
`;

const PillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
`;

const Pill = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 245, 160, 0.15);
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 100px;
  font-size: 0.8rem;
  text-align: center;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 10px rgba(0, 245, 160, 0.3);
  }
`;

const PillTitle = styled.div`
  color: #9fb7c7;
  font-size: 0.75rem;
  margin-bottom: 2px;
`;

const PillValue = styled.div`
  font-weight: 700;
  color: #bfffe6;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
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

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMining && lastClaimTime) {
        const now = Date.now();
        const diff = 24 * 60 * 60 * 1000 - (now - lastClaimTime);
        if (diff <= 0) {
          setCountdown("Ready to Claim!");
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

  // Auto Transfer Pending Tokens When KYC Approved
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
        <Card>
          <CardTitle>Mining</CardTitle>
          <CardValue>{isMining ? "Running" : "Stopped"}</CardValue>
          <SecondaryText>Earn 1 QNT every 24 hours of mining.</SecondaryText>
          {!isMining && <NeonButton onClick={startMining}>Start Mining</NeonButton>}
          {isMining && <NeonButton onClick={claimReward}>{countdown === "Ready to Claim!" ? "Claim Reward" : countdown}</NeonButton>}
        </Card>

        <Card>
          <CardTitle>Referral Program</CardTitle>
          <SecondaryText>
            Level 1 → 10 QNT <br />
            Level 2 → 9 QNT <br />
            Level 3 → 7 QNT
          </SecondaryText>
          <NeonButton onClick={() => addReferral(1)}>Add Level 1</NeonButton>
          <NeonButton onClick={() => addReferral(2)}>Add Level 2</NeonButton>
          <NeonButton onClick={() => addReferral(3)}>Add Level 3</NeonButton>
        </Card>

        <Card>
          <CardTitle>KYC Status</CardTitle>
          <CardValue style={{ color: kycStatus === "approved" ? "#00f5a0" : kycStatus === "pending" ? "#ffc107" : "#ff6b6b" }}>
            {kycStatus}
          </CardValue>
          <NeonButton onClick={() => navigate("/kyc")}>{kycStatus === "approved" ? "View KYC" : "Complete KYC"}</NeonButton>
        </Card>

        <Card>
          <CardTitle>Referral Stats</CardTitle>
          <CardValue>{referrals.length} Joined</CardValue>
          <SecondaryText>Total Earned: {referrals.reduce((a, r) => a + (r.reward || 0), 0)} QNT</SecondaryText>
        </Card>
      </Grid>

      <BottomBox initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <PillContainer>
          <Pill>
            <PillTitle>Status</PillTitle>
            <PillValue>{isMining ? "Mining Active" : "Idle"}</PillValue>
          </Pill>

          <Pill>
            <PillTitle>Claim Time</PillTitle>
            <PillValue>{countdown || "Not started"}</PillValue>
          </Pill>

          <Pill>
            <PillTitle>Pending Tokens</PillTitle>
            <PillValue>{pending.toFixed(3)}</PillValue>
          </Pill>

          <Pill>
            <PillTitle>KYC</PillTitle>
            <PillValue>{kycStatus}</PillValue>
          </Pill>
        </PillContainer>

        <Actions>
          <NeonButton onClick={() => navigate("/wallet", { state: { openSendModal: true } })}>➤ Send</NeonButton>
          <NeonButton onClick={() => navigate("/wallet")}>⇣ Receive</NeonButton>
        </Actions>
      </BottomBox>
    </Page>
  );
};

export default Dashboard;
