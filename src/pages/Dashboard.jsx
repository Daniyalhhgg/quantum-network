import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ---------- Styled Components (unchanged) ----------
const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #0b1224, #060b16 80%);
  color: #e6f1ff;
  padding: 1rem clamp(0.5rem, 2vw, 2rem) 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
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
`;
const Balance = styled.div`
  font-size: clamp(1rem, 1.8vw, 1.3rem);
  font-weight: 700;
  color: #bfffe6;
  text-align: right;
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
`;
const CardTitle = styled.div`
  color: #00f5a0;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
`;
const CardValue = styled.div`
  font-size: clamp(1.2rem, 2vw, 1.5!rem);
  font-weight: 800;
  margin-bottom: 0.4rem;
`;
const SecondaryText = styled.div`
  color: #9fb7c7;
  font-size: clamp(0.85rem, 1vw, 0.95rem);
  line-height: 1.4;
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
`;
const BottomBox = styled(motion.div)`
  position: fixed;
  left: 7.5%;
  bottom: 55px;
  transform: translateX(-50%);
  width: 80%;
  max-width: 420px;
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
  @media (min-width: 768px) {
    left: 50%;
    bottom: 15px;
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
const Skeleton = styled.div`
  height: ${(p) => p.h || "16px"};
  width: ${(p) => p.w || "100%"};
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%);
  border-radius: 8px;
  background-size: 200%;
  animation: loading 1.5s infinite;
  @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;
const Toast = styled(motion.div)`
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 245, 160, 0.18);
  color: #00f5a0;
  padding: 10px 20px;
  border-radius: 50px;
  border: 1px solid rgba(0, 245, 160, 0.3);
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 9999;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 245, 160, 0.3);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// ---------- Helpers ----------
const formatQNT = (n) => (n == null ? "0.000" : Number(n).toFixed(3));
const msToHMS = (ms) => {
  if (ms <= 0) return "0h 0m 0s";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms / (1000 * 60)) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return `${h}h ${m}m ${s}s`;
};

// ---------- Axios ----------
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ---------- MAIN DASHBOARD ----------
export default function Dashboard() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("userInfo");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const token = user?.token;

  const [balance, setBalance] = useState(0);
  const [pending, setPending] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [lastStartTime, setLastStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [kycStatus, setKycStatus] = useState("not_submitted");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const mountedRef = useRef(true);
  const pollRef = useRef(null);

  // Token header
  useEffect(() => {
    const interceptor = api.interceptors.request.use(cfg => {
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  // Fetch status
  const fetchStatus = async (signal) => {
    try {
      const { data } = await api.get("/mining/status", { signal });
      setBalance(data.balance ?? 0);
      setPending(data.pendingBalance ?? 0);
      setIsMining(data.mining?.isMining ?? false);
      setLastStartTime(data.mining?.lastStartTime || 0);
      setReferrals(data.referrals || []);
      setKycStatus(data.kycStatus || "not_submitted");

      if (data.mining?.isMining && data.mining.lastStartTime) {
        const left = 24 * 60 * 60 * 1000 - (Date.now() - data.mining.lastStartTime);
        setTimeLeft(Math.max(Math.ceil(left / 1000), 0));
      } else {
        setTimeLeft(null);
      }
    } catch (err) {
      if (err.name !== "CanceledError") console.error(err);
    }
  };

  // Mount + poll
  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    const controller = new AbortController();
    const boot = async () => {
      setIsLoading(true);
      await fetchStatus(controller.signal);
      setIsLoading(false);
      pollRef.current = setInterval(() => fetchStatus(), 8000);
    };
    boot();
    return () => {
      mountedRef.current = false;
      controller.abort();
      clearInterval(pollRef.current);
    };
  }, [token]);

  // Countdown
  useEffect(() => {
    if (timeLeft == null) return setCountdown("");
    const update = (s) => setCountdown(s <= 0 ? "Ready!" : msToHMS(s * 1000));
    update(timeLeft);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { update(0); return 0; }
        update(prev - 1);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Mining Actions
  const startMining = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const { data } = await api.post("/mining/start");
      setBalance(data.balance ?? balance);
      setPending(data.pendingBalance ?? pending);
      setIsMining(true);
      setLastStartTime(data.mining?.lastStartTime || Date.now());
      const left = 24 * 60 * 60 * 1000 - (Date.now() - (data.mining?.lastStartTime || Date.now()));
      setTimeLeft(Math.max(Math.ceil(left / 1000), 0));
    } catch (e) {
      setToast(e?.response?.data?.message || "Failed to start mining");
    } finally {
      setActionLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const claimReward = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const { data } = await api.post("/mining/claim");
      setPending(data.pendingBalance);
      setBalance(data.balance);
      setIsMining(false);
      setTimeLeft(null);
      setToast(`+1 QNT claimed to Pending!`);
    } catch (e) {
      setToast(e?.response?.data?.message || "Claim failed");
    } finally {
      setActionLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const moveToWallet = async () => {
    if (actionLoading || kycStatus !== "approved" || pending <= 0) return;
    setActionLoading(true);
    try {
      const { data } = await api.post("/mining/move-to-wallet");
      setBalance(data.balance);
      setPending(0);
      setToast(`Moved ${formatQNT(pending)} QNT to wallet!`);
    } catch (e) {
      setToast(e?.response?.data?.message || "Move failed");
    } finally {
      setActionLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const copyReferralLink = async () => {
    const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setToast("Copied to clipboard!");
    } catch (err) {
      setToast("Failed to copy");
    } finally {
      setTimeout(() => setToast(null), 2000);
    }
  };

  const goToKyc = () => navigate("/kyc");
  const openSend = () => navigate("/wallet", { state: { openSendModal: true } });
  const openWallet = () => navigate("/wallet");

  const totalReferralEarned = useMemo(() =>
    referrals.reduce((sum, r) => sum + (r.reward || 1), 0), [referrals]
  );

  return (
    <Page>
      <Header initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Quantum Dashboard</Title>
        <Balance>
          {isLoading ? <Skeleton w="120px" h="22px" /> : `${formatQNT(balance)} QNT`}
        </Balance>
      </Header>

      <Grid>
        {/* Mining Card */}
        <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <CardTitle>Mining Status</CardTitle>
          <CardValue>{isLoading ? <Skeleton w="80px" /> : isMining ? "Active" : "Stopped"}</CardValue>
          <SecondaryText>Earn 1 QNT every 24 hours</SecondaryText>

          {!isMining ? (
            <NeonButton onClick={startMining} disabled={actionLoading || isLoading} whileTap={{ scale: 0.95 }}>
              {actionLoading ? "Starting..." : "Start Mining"}
            </NeonButton>
          ) : (
            <NeonButton disabled={actionLoading} whileTap={{ scale: 0.95 }}>
              {countdown === "Ready!" ? (actionLoading ? "Claiming..." : "Claim Now") : countdown}
            </NeonButton>
          )}

          {/* Claim Button */}
          {isMining && countdown === "Ready!" && (
            <NeonButton
              onClick={claimReward}
              style={{ marginTop: "8px" }}
              whileTap={{ scale: 0.95 }}
              disabled={actionLoading}
            >
              {actionLoading ? "Claiming..." : "Claim to Pending"}
            </NeonButton>
          )}

          {/* Move to Wallet Button */}
          {pending > 0 && (
            <NeonButton
              onClick={moveToWallet}
              disabled={actionLoading || kycStatus !== "approved" || pending <= 0}
              style={{
                marginTop: "8px",
                borderColor: kycStatus === "approved" ? "#00f5a0" : "#ff6b6b",
                color: kycStatus === "approved" ? "#00f5a0" : "#ff6b6b"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {actionLoading
                ? "Moving..."
                : kycStatus === "approved"
                  ? `Move ${formatQNT(pending)} to Wallet`
                  : "KYC Required"
              }
            </NeonButton>
          )}
        </Card>

        {/* Referral Code Card */}
        <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CardTitle>Your Referral Code</CardTitle>
          <CardValue>{user?.referralCode || "Loading..."}</CardValue>
          <SecondaryText>
            Share this link:<br />
            <span style={{ color: "#00f5a0", fontSize: "0.85rem", wordBreak: "break-all" }}>
              {window.location.origin}/register?ref={user?.referralCode || "..."}
            </span>
          </SecondaryText>
          <NeonButton
            onClick={copyReferralLink}
            disabled={!user?.referralCode || actionLoading}
            whileTap={{ scale: 0.95 }}
          >
            Copy Link
          </NeonButton>
        </Card>

        {/* Referrals List */}
        <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <CardTitle>Your Referrals ({referrals.length})</CardTitle>
          <CardValue>+{formatQNT(totalReferralEarned)} QNT Earned</CardValue>
          <SecondaryText>
            {referrals.length === 0 ? (
              "Invite friends & earn 1 QNT per referral!"
            ) : (
              <div style={{ maxHeight: "200px", overflowY: "auto", marginTop: "8px" }}>
                {referrals
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((ref, i) => (
                    <div key={i} style={{
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(0,245,160,0.15)",
                      fontSize: "0.88rem",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>{ref.email || ref.name || "User"}</span>
                      <span style={{ color: "#00f5a0", fontWeight: "600" }}>+1 QNT</span>
                    </div>
                  ))}
              </div>
            )}
          </SecondaryText>
        </Card>

        {/* KYC Card */}
        <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <CardTitle>KYC Status</CardTitle>
          <CardValue style={{
            color: kycStatus === "approved" ? "#00f5a0" : kycStatus === "pending" ? "#ffc107" : "#ff6b6b"
          }}>
            {isLoading ? <Skeleton w="90px" /> : kycStatus.replace("_", " ").toUpperCase()}
          </CardValue>
          <NeonButton onClick={goToKyc} whileTap={{ scale: 0.95 }}>
            {kycStatus === "approved" ? "View KYC" : "Complete KYC"}
          </NeonButton>
        </Card>
      </Grid>

      {/* Bottom Fixed Box */}
      <BottomBox initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
        <PillContainer>
          <Pill><PillTitle>Status</PillTitle><PillValue>{isMining ? "Mining" : "Idle"}</PillValue></Pill>
          <Pill><PillTitle>Claim In</PillTitle><PillValue>{countdown || "-"}</PillValue></Pill>
          <Pill><PillTitle>Pending</PillTitle><PillValue>{formatQNT(pending)}</PillValue></Pill>
          <Pill><PillTitle>Referrals</PillTitle><PillValue>{referrals.length}</PillValue></Pill>
        </PillContainer>
        <Actions>
          <ActionButton onClick={openSend} whileTap={{ scale: 0.95 }}>Send</ActionButton>
          <ActionButton onClick={openWallet} whileTap={{ scale: 0.95 }}>Receive</ActionButton>
        </Actions>
      </BottomBox>

      {/* Toast */}
      {toast && (
        <Toast
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {toast}
        </Toast>
      )}
    </Page>
  );
}