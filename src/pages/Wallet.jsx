// ============================================================================
// Quantum Wallet — FULLY RESPONSIVE + Mobile-First Edition
// ============================================================================
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import {
  FiSend,
  FiDownload,
  FiCopy,
  FiShield,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE, timeout: 12000 });

// ============================================================================
// Fully Responsive Styled Components
// ============================================================================
const Page = styled.div`
  min-height: 100vh;
  padding: 1.5rem 1rem;
  color: #e9f6f1;
  background:
    radial-gradient(900px 500px at 5% 10%, rgba(0, 245, 160, 0.09), transparent 55%),
    linear-gradient(180deg, #091121 0%, #0c1323 55%, #101726 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Section = styled(motion.section)`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: stretch;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandLogo = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #00f5a0, #00d9f5);
  display: grid;
  place-items: center;
  font-size: 19px;
  font-weight: 900;
  color: #021728;
  flex-shrink: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
`;

const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 380px;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
`;

const Amount = styled.div`
  font-size: clamp(36px, 8vw, 52px);
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00e5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
`;

const Small = styled.small`
  font-size: 13px;
  color: #9fb6c3;
  display: block;
`;

const Btn = styled(motion.button)`
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  min-width: 100px;
  background: ${(p) => (p.ghost ? "rgba(255,255,255,0.03)" : "linear-gradient(90deg,#00f5a0,#00e5f5)")};
  color: ${(p) => (p.ghost ? "#e6f7f5" : "#04201b")};
  border: ${(p) => (p.ghost ? "1px solid rgba(255,255,255,0.08)" : "none")};
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const AddressBox = styled.div`
  background: rgba(0, 0, 0, 0.35);
  padding: 1rem;
  border-radius: 16px;
  border: 1px dashed rgba(0, 245, 160, 0.25);
  text-align: center;
  margin-bottom: 1.5rem;
  word-break: break-all;
`;

const Mono = styled.code`
  font-size: 13px;
  display: block;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  background: #020b1d;
  color: #00f5a0;
  word-break: break-all;
  line-height: 1.4;
`;

const TxBox = styled.div`
  margin-top: 1rem;
`;

const TxListScroll = styled.div`
  max-height: 58vh;
  overflow-y: auto;
  padding-right: 4px;
  margin-top: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 245, 160, 0.3);
    border-radius: 3px;
  }
`;

const TxItem = styled.div`
  background: rgba(255, 255, 255, 0.025);
  padding: 14px;
  border-radius: 16px;
  margin-bottom: 12px;
  border-left: 5px solid ${(p) => (p.sent ? "#ff6b6b" : "#2ed573")};
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 500px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TxLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const TxRight = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const StatusPill = styled.div`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${(p) => (p.pending ? "rgba(255,100,100,0.12)" : "rgba(0,255,150,0.12)")};
  border: 1px solid ${(p) => (p.pending ? "rgba(255,80,80,0.25)" : "rgba(0,255,150,0.25)")};
  color: ${(p) => (p.pending ? "#ff6b6b" : "#2ed573")};
  font-weight: 700;
  display: inline-block;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: #091321;
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(0, 245, 160, 0.2);
`;

const Input = styled.input`
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #071221;
  color: #e8f8f4;
  font-size: 15px;
  width: 100%;
  outline: none;
  margin-top: 8px;
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 245, 160, 0.25);
  color: #00f5a0;
  padding: 12px 24px;
  border-radius: 50px;
  border: 1px solid rgba(0, 245, 160, 0.4);
  font-weight: 600;
  font-size: 0.95rem;
  z-index: 9999;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 245, 160, 0.3);
`;

// ============================================================================
// Helpers
// ============================================================================
const fmt = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 });
const shorten = (str) => str ? `${str.slice(0, 8)}...${str.slice(-6)}` : "-";

const getToken = () => {
  try { return JSON.parse(localStorage.getItem("userInfo"))?.token; } catch { return null; }
};

// ============================================================================
// Main Component
// ============================================================================
export default function Wallet() {
  const [state, setState] = useState({
    loading: true,
    balance: 0,
    pendingBalance: 0,
    address: "",
    transactions: [],
    kycStatus: "not_submitted",
  });

  const [sendModal, showSend] = useState(false);
  const [receiveModal, showReceive] = useState(false);
  const [form, setForm] = useState({ to: "", amount: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const mounted = useRef(true);
  const token = getToken();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const copy = async (text, msg = "Copied!") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      showToast("Copy failed");
    }
  };

  const isSent = (tx) =>
    tx?.from && state?.address && tx.from.toLowerCase() === state.address.toLowerCase();

  const loadWallet = async () => {
    if (!token) return setState(s => ({ ...s, loading: false }));
    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const { data } = await api.get("/wallet/info");
      const txs = (data.transactions || []).map(t => ({
        date: t.date || t.timestamp || new Date().toISOString(),
        amount: t.amount ?? t.value ?? 0,
        from: t.from || t.sender || "",
        to: t.to || t.recipient || "",
        txid: t.txid || t.hash || t.id || "",
        status: (t.status || "success").toLowerCase(),
      }));

      if (mounted.current) {
        setState({
          loading: false,
          balance: data.balance || 0,
          pendingBalance: data.pendingBalance || 0,
          address: data.address || "",
          kycStatus: data.kycStatus || "not_submitted",
          transactions: txs,
        });
      }
    } catch (err) {
      if (mounted.current) setState(s => ({ ...s, loading: false }));
    }
  };

  useEffect(() => {
    mounted.current = true;
    loadWallet();
    const id = setInterval(loadWallet, 10000);
    return () => { mounted.current = false; clearInterval(id); };
  }, []);

  const sendTx = async () => {
    if (!form.to || !form.amount) return showToast("Fill all fields");
    try {
      setSending(true);
      await api.post("/wallet/send", { to: form.to.trim(), amount: Number(form.amount) });
      showToast("Sent Successfully!");
      showSend(false);
      setForm({ to: "", amount: "" });
      loadWallet();
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Page>
      <Section>
        <Header>
          <Brand>
            <BrandLogo>PW</BrandLogo>
            <div>
              <Title>Pytro Wallet</Title>
              <Small>Secure • Fast • Web3 Ready</Small>
            </div>
          </Brand>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <Btn ghost onClick={loadWallet}><FiRefreshCw /> Refresh</Btn>
            <Btn onClick={() => showReceive(true)}><FiDownload /> Receive</Btn>
            <Btn onClick={() => showSend(true)}><FiSend /> Send</Btn>
          </div>
        </Header>

        <CardGrid>
          <Card>
            {state.loading ? (
              <Small>Loading...</Small>
            ) : (
              <>
                <Small>Available Balance</Small>
                <Amount>{fmt(state.balance)} PNT</Amount>
                {state.pendingBalance > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <Small>Pending Amount</Small>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#00e5f5" }}>
                      {fmt(state.pendingBalance)} PNT
                    </div>
                  </div>
                )}
                <Btn ghost style={{ marginTop: "1.5rem" }}>
                  <FiShield /> {state.kycStatus === "approved" ? "Verified" : "Limited"}
                </Btn>
              </>
            )}
          </Card>

          <div>
            <AddressBox>
              <Small>Your Address</Small>
              <Mono>{state.address || "Not connected"}</Mono>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <Btn ghost onClick={() => copy(state.address)}>Copy</Btn>
                <Btn ghost onClick={() => showReceive(true)}>QR</Btn>
              </div>
            </AddressBox>

            <TxBox>
              <Small style={{ fontWeight: 700, fontSize: "15px" }}>Recent Transactions</Small>
              <TxListScroll>
                {state.transactions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem 0", opacity: 0.6 }}>
                    <Small>No transactions yet</Small>
                  </div>
                ) : (
                  state.transactions.map((tx, i) => (
                    <TxItem key={i} sent={isSent(tx)}>
                      <TxLeft>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <StatusPill pending={tx.status === "pending"}>
                            {tx.status === "pending" ? "Pending" : "Success"}
                          </StatusPill>
                          <strong>{isSent(tx) ? "Sent" : "Received"}</strong>
                        </div>
                        <div style={{ fontSize: "13px", color: "#bfe9d9", marginTop: "4px" }}>
                          {isSent(tx) ? "To: " : "From: "}
                          <code style={{ color: "#00f5a0" }}>{shorten(isSent(tx) ? tx.to : tx.from)}</code>
                        </div>
                        <Small style={{ marginTop: "4px" }}>
                          {new Date(tx.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        </Small>
                      </TxLeft>

                      <TxRight>
                        <div style={{ fontSize: "19px", fontWeight: 900, color: isSent(tx) ? "#ff6b6b" : "#2ed573" }}>
                          {isSent(tx) ? "-" : "+"}{fmt(tx.amount)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Fee: 0 PNT</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", justifyContent: "flex-end" }}>
                          <code style={{ fontSize: "11px", color: "#00d9f5" }}>{shorten(tx.txid)}</code>
                          <Btn ghost style={{ padding: "4px 6px" }} onClick={() => copy(tx.txid)}>
                            <FiCopy size={13} />
                          </Btn>
                        </div>
                      </TxRight>
                    </TxItem>
                  ))
                )}
              </TxListScroll>
            </TxBox>
          </div>
        </CardGrid>
      </Section>

      {/* Modals */}
      <AnimatePresence>
        {sendModal && (
          <ModalOverlay onClick={() => showSend(false)}>
            <ModalBox onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3>Send PNT</h3>
                <FiX size={24} style={{ cursor: "pointer" }} onClick={() => showSend(false)} />
              </div>
              <div><Small>To Address</Small><Input value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="0x..." /></div>
              <div style={{ marginTop: "1rem" }}><Small>Amount</Small><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.0000" /></div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <Btn ghost onClick={() => showSend(false)}>Cancel</Btn>
                <Btn onClick={sendTx} disabled={sending}>{sending ? "Sending..." : "Send"}</Btn>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}

        {receiveModal && (
          <ModalOverlay onClick={() => showReceive(false)}>
            <ModalBox onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3>Receive PNT</h3>
                <FiX size={24} style={{ cursor: "pointer" }} onClick={() => showReceive(false)} />
              </div>
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <QRCodeCanvas value={state.address} size={200} fgColor="#00f5a0" />
                <Mono style={{ marginTop: "1rem", fontSize: "12px" }}>{state.address}</Mono>
                <Btn ghost style={{ marginTop: "1rem" }} onClick={() => copy(state.address)}>Copy Address</Btn>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {toast && (
        <Toast initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
          {toast}
        </Toast>
      )}
    </Page>
  );
    }
