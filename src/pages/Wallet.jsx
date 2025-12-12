// ============================================================================
// Quantum Wallet — Transaction History Enhanced Edition (Fee = 0)
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

// API Setup
const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE, timeout: 12000 });

// ---------------------------------------------------------------------------
// Styled Components
// ---------------------------------------------------------------------------
const Page = styled.div`
  min-height: 100vh;
  padding: 3rem 1rem;
  color: #e9f6f1;
  background:
    radial-gradient(900px 500px at 5% 10%, rgba(0, 245, 160, 0.09), transparent 55%),
    linear-gradient(180deg, #091121 0%, #0c1323 55%, #101726 100%);
  font-family: 'Inter', sans-serif;
`;

const Section = styled(motion.section)`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 14px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandLogo = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #00f5a0, #00d9f5);
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 900;
  color: #021728;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 22px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
`;

const Amount = styled.div`
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00e5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Small = styled.small`
  font-size: 13px;
  color: #9fb6c3;
`;

const Btn = styled(motion.button)`
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  transition: 0.25s;
  background: ${(p) => (p.ghost ? "rgba(255,255,255,0.03)" : "linear-gradient(90deg,#00f5a0,#00e5f5)")};
  color: ${(p) => (p.ghost ? "#e6f7f5" : "#04201b")};
  border: ${(p) => (p.ghost ? "1px solid rgba(255,255,255,0.05)" : "none")};
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const AddressBox = styled.div`
  background: rgba(0, 0, 0, 0.32);
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed rgba(0, 245, 160, 0.2);
  text-align: center;
`;

const Mono = styled.code`
  font-size: 14px;
  word-break: break-all;
  display: block;
  padding: 10px;
  margin-top: 8px;
  border-radius: 10px;
  background: #020b1d;
  color: #00f5a0;
`;

const TxBox = styled.div`
  margin-top: 20px;
`;

const TxListScroll = styled.div`
  max-height: 420px;
  overflow-y: auto;
  padding-right: 8px;
  margin-top: 12px;
`;

// Enhanced Transaction Row
const TxItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 12px;
  border-left: 5px solid ${(p) => (p.sent ? "#ff6b6b" : "#2ed573")};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const TxLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 260px;
`;

const TxRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
  text-align: right;
  @media (max-width: 600px) {
    align-items: flex-start;
  }
`;

const StatusPill = styled.div`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${(p) => (p.pending ? "rgba(255,100,100,0.1)" : "rgba(0,255,150,0.1)")};
  border: 1px solid ${(p) => (p.pending ? "rgba(255,80,80,0.2)" : "rgba(0,255,150,0.2)")};
  color: ${(p) => (p.pending ? "#ff6b6b" : "#2ed573")};
  font-weight: 700;
  align-self: flex-start;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalBox = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  background: #091321;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(0, 245, 160, 0.15);
`;

const Input = styled.input`
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #071221;
  color: #e8f8f4;
  font-size: 15px;
  width: 100%;
  outline: none;
  margin-top: 8px;
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 245, 160, 0.2);
  color: #00f5a0;
  padding: 12px 24px;
  border-radius: 50px;
  border: 1px solid rgba(0, 245, 160, 0.4);
  font-weight: 600;
  font-size: 0.95rem;
  z-index: 9999;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 245, 160, 0.3);
  white-space: nowrap;
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fmt = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 });

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo"))?.token;
  } catch {
    return null;
  }
};

const shorten = (addr) => addr ? `${addr.slice(0, 10)}...${addr.slice(-8)}` : "-";

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
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
  const toastTimer = useRef(null);
  const mounted = useRef(true);
  const token = getToken();

  const showToast = (msg, duration = 2500) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), duration);
  };

  const copy = async (text, msg = "Copied!") => {
    if (!text) return showToast("Nothing to copy");
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      showToast("Copy failed");
    }
  };

  const isSent = (tx) =>
    tx?.from && state?.address && tx.from.toLowerCase() === state.address.toLowerCase();

  // Fetch Wallet
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
      console.error(err);
      if (mounted.current) setState(s => ({ ...s, loading: false }));
    }
  };

  useEffect(() => {
    mounted.current = true;
    loadWallet();
    const id = setInterval(loadWallet, 10000);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, []);

  const sendTx = async () => {
    if (!form.to || !form.amount) return showToast("Fill all fields");
    try {
      setSending(true);
      const payload = { to: form.to.trim(), amount: Number(form.amount) };
      const { data } = await api.post("/wallet/send", payload);
      showToast("Transaction submitted!");
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
      <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Header>
          <Brand>
            <BrandLogo>PW</BrandLogo>
            <div>
              <Title>Pytro Wallet</Title>
              <Small>Non-custodial · Secure · Web3-Ready</Small>
            </div>
          </Brand>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn ghost onClick={loadWallet} whileTap={{ scale: 0.95 }}>
              <FiRefreshCw /> Refresh
            </Btn>
            <Btn onClick={() => showReceive(true)} whileTap={{ scale: 0.95 }}>
              <FiDownload /> Receive
            </Btn>
            <Btn onClick={() => showSend(true)} whileTap={{ scale: 0.95 }}>
              <FiSend /> Send
            </Btn>
          </div>
        </Header>

        <CardGrid>
          {/* Balance */}
          <Card layout>
            {state.loading ? (
              <Small>Loading wallet...</Small>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <Small>Available Balance</Small>
                  <Amount>{fmt(state.balance)} PNT</Amount>
                </div>
                {state.pendingBalance > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Small>Pending Balance</Small>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#00e5f5" }}>
                      {fmt(state.pendingBalance)} PNT
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 20 }}>
                  <Btn ghost style={{ padding: "8px 14px" }}>
                    <FiShield /> {state.kycStatus === "approved" ? "KYC Verified" : "Limited Access"}
                  </Btn>
                </div>
              </>
            )}
          </Card>

          {/* Address + Transactions */}
          <div>
            <AddressBox>
              <Small>Your Address</Small>
              <Mono>{state.address || "Not connected"}</Mono>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
                <Btn ghost onClick={() => copy(state.address)} whileTap={{ scale: 0.95 }}>
                  <FiCopy /> Copy
                </Btn>
                <Btn ghost onClick={() => showReceive(true)} whileTap={{ scale: 0.95 }}>
                  <FiDownload /> QR Code
                </Btn>
              </div>
            </AddressBox>

            <TxBox>
              <Small style={{ fontWeight: 700 }}>Transaction History</Small>
              <TxListScroll>
                {state.transactions.length === 0 ? (
                  <Small style={{ textAlign: "center", marginTop: 20, opacity: 0.6 }}>
                    No transactions yet
                  </Small>
                ) : (
                  state.transactions.map((tx, i) => (
                    <TxItem key={i} sent={isSent(tx)}>
                      <TxLeft>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <StatusPill pending={tx.status === "pending"}>
                            {tx.status === "pending" ? "Pending" : "Success"}
                          </StatusPill>
                          <strong>{isSent(tx) ? "Sent" : "Received"}</strong>
                        </div>

                        <div style={{ fontSize: 13, color: "#bfe9d9", marginTop: 4 }}>
                          {isSent(tx) ? (
                            <>To: <code style={{ color: "#00f5a0" }}>{shorten(tx.to)}</code></>
                          ) : (
                            <>From: <code style={{ color: "#00f5a0" }}>{shorten(tx.from)}</code></>
                          )}
                        </div>

                        <Small style={{ marginTop: 6 }}>
                          {new Date(tx.date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Small>
                      </TxLeft>

                      <TxRight>
                        <div style={{
                          fontSize: 20,
                          fontWeight: 900,
                          color: isSent(tx) ? "#ff6b6b" : "#2ed573",
                        }}>
                          {isSent(tx) ? "-" : "+"}{fmt(tx.amount)} PNT
                        </div>

                        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                          Fee: 0 PNT
                        </div>

                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 6,
                          fontSize: 12,
                        }}>
                          <code style={{ color: "#00d9f5" }}>
                            {shorten(tx.txid)}
                          </code>
                          <Btn
                            ghost
                            style={{ padding: "4px 8px" }}
                            onClick={() => copy(tx.txid, "Tx ID copied!")}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiCopy size={14} />
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

      {/* Modals & Toast */}
      <AnimatePresence>
        {sendModal && (
          <ModalOverlay onClick={() => showSend(false)}>
            <ModalBox onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3>Send PNT</h3>
                <FiX size={24} style={{ cursor: "pointer" }} onClick={() => showSend(false)} />
              </div>
              <div><Small>Recipient Address</Small><Input value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="0x..." /></div>
              <div style={{ marginTop: 16 }}><Small>Amount</Small><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.0000" /></div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <Btn ghost onClick={() => showSend(false)}>Cancel</Btn>
                <Btn onClick={sendTx} disabled={sending}>{sending ? "Sending..." : "Send"}</Btn>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}

        {receiveModal && (
          <ModalOverlay onClick={() => showReceive(false)}>
            <ModalBox onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3>Receive PNT</h3>
                <FiX size={24} style={{ cursor: "pointer" }} onClick={() => showReceive(false)} />
              </div>
              <div style={{ textAlign: "center" }}>
                <QRCodeCanvas value={state.address} size={220} fgColor="#00f5a0" bgColor="transparent" />
                <Mono style={{ marginTop: 20, fontSize: 13 }}>{state.address}</Mono>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
                  <Btn ghost onClick={() => copy(state.address)}>Copy Address</Btn>
                  <Btn onClick={() => showReceive(false)}>Close</Btn>
                </div>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {toast && (
        <Toast initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
          {toast}
        </Toast>
      )}
    </Page>
  );
    }
