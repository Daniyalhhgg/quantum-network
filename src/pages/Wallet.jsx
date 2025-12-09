// ============================================================================
//  Quantum Wallet — Corrected Balance Logic Edition
//  No UI changes — Just fixed auto-balance issue
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
  grid-template-columns: 1fr 360px;
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
  background: ${(p) =>
    p.ghost ? "rgba(255,255,255,0.03)" : "linear-gradient(90deg,#00f5a0,#00e5f5)"};
  color: ${(p) => (p.ghost ? "#e6f7f5" : "#04201b")};
  border: ${(p) => (p.ghost ? "1px solid rgba(255,255,255,0.05)" : "none")};

  &:hover {
    opacity: 0.85;
  }
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
  max-height: 340px;
  overflow-y: auto;
  padding-right: 8px;
  margin-top: 12px;
`;

const TxItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 14px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-left: 5px solid ${(p) => (p.sent ? "#ff6b6b" : "#2ed573")};
`;

const TxMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TxRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`;

const StatusPill = styled.div`
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 999px;
  background: ${(p) =>
    p.pending ? "rgba(255,195,195,0.07)" : "rgba(196,255,255,0.06)"};
  border: 1px solid ${(p) =>
    p.pending ? "rgba(255,110,110,0.12)" : "rgba(46,213,115,0.1)"};
  color: ${(p) => (p.pending ? "#ff6b6b" : "#7cf0a5")};
  font-weight: 700;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalBox = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  background: #091321;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(0, 245, 160, 0.1);
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #071221;
  color: #e8f8f4;
  font-size: 14px;
  width: 100%;
  outline: none;
`;

// ---------------------------------------------------------------------------
// Toast Component
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  });

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo"))?.token;
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Wallet() {
  const [state, setState] = useState({
    loading: true,
    balance: 0,
    pendingBalance: 0,     // <-- Pending
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

  // Toast Helper
  const showToast = (msg, duration = 2000) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), duration);
  };

  // Copy Helper
  const copy = async (text, msg = "Copied!") => {
    if (!text) return showToast("Nothing to copy");

    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast(msg);
      } catch {
        showToast("Copy failed");
      }
    }
  };

  const isSent = (tx) =>
    tx?.from &&
    state?.address &&
    tx.from.toLowerCase() === state.address.toLowerCase();

  // ---------------------------------------------------------------------------
  // Fetch Wallet
  // ---------------------------------------------------------------------------

  const loadWallet = async () => {
    if (!token) return setState((s) => ({ ...s, loading: false }));

    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const { data } = await api.get("/wallet/info");

      const txs = (data.transactions || []).map((t) => ({
        date: t.date || t.timestamp || new Date().toISOString(),
        amount: t.amount ?? t.value ?? 0,
        from: t.from || t.sender || "",
        to: t.to || t.recipient || "",
        txid: t.txid || t.hash || t.id || "",
        status: (t.status || t.state || "success").toLowerCase(),
      }));

      if (!mounted.current) return;

      // ❗ totalBalance removed
      setState({
        loading: false,
        balance: data.balance || 0,
        pendingBalance: data.pendingBalance || 0,
        address: data.address || "",
        kycStatus: data.kycStatus || "not_submitted",
        transactions: txs,
      });
    } catch (err) {
      console.error("loadWallet error", err);
      if (!mounted.current) return;
      setState((s) => ({ ...s, loading: false }));
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

  // ---------------------------------------------------------------------------
  // Send Transaction
  // ---------------------------------------------------------------------------

  const sendTx = async () => {
    if (!form.to || !form.amount) return showToast("Enter address & amount");

    try {
      setSending(true);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      const payload = { to: form.to.trim(), amount: Number(form.amount) };
      const { data } = await api.post("/wallet/send", payload);

      showToast("Transaction submitted!");

      showSend(false);
      setForm({ to: "", amount: "" });
      loadWallet();

      if (data?.tx) {
        setState((s) => ({
          ...s,
          transactions: [
            {
              date: data.tx.date || new Date().toISOString(),
              amount: data.tx.amount || payload.amount,
              from: data.tx.from || s.address || "",
              to: data.tx.to || payload.to,
              txid: data.tx.txid || data.tx.hash || "",
              status: (data.tx.status || "pending").toLowerCase(),
            },
            ...s.transactions,
          ],
        }));
      }
    } catch (e) {
      console.error("sendTx error", e);
      showToast(e?.response?.data?.message || "Transaction failed");
    }
    setSending(false);
  };

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------

  return (
    <Page>
      <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
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

        {/* Main Grid */}
        <CardGrid>

          {/* Balance Card */}
          <Card layout>
            {state.loading ? (
              <Small>Loading...</Small>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <Small>Available Balance</Small>
                  <Amount>{fmt(state.balance)} PNT</Amount>
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Btn ghost style={{ padding: "6px 12px" }}>
                      <FiShield />
                      {state.kycStatus === "approved"
                        ? "KYC Verified"
                        : "Limited Access"}
                    </Btn>
                  </div>
                </div>

                {/* Pending Balance */}
                <div style={{ marginTop: 10 }}>
                  <Small>Pending (Not moved)</Small>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#00e5f5",
                    }}
                  >
                    {fmt(state.pendingBalance)}
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Address & Transactions */}
          <div>

            {/* Address */}
            <AddressBox>
              <Small>Your Address</Small>
              <Mono>{state.address || "Not logged in"}</Mono>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Btn
                  ghost
                  onClick={() => copy(state.address, "Address copied!")}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiCopy /> Copy
                </Btn>
                <Btn
                  ghost
                  onClick={() => showReceive(true)}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiDownload /> QR
                </Btn>
              </div>
            </AddressBox>

            {/* Transactions */}
            <TxBox>
              <Small>Recent Activity</Small>
              <TxListScroll>
                {state.transactions?.length ? (
                  state.transactions.map((tx, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <TxItem sent={isSent(tx)}>
                        <TxMeta>
                          <div style={{ fontWeight: 800 }}>
                            {isSent(tx) ? "Sent" : "Received"}
                          </div>
                          <Small>
                            {new Date(tx.date).toLocaleString()}
                          </Small>

                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 13,
                              color: "#bfe9d9",
                            }}
                          >
                            {isSent(tx) ? (
                              <div>
                                To:{" "}
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                  }}
                                >
                                  {tx.to || "-"}
                                </span>
                              </div>
                            ) : (
                              <div>
                                From:{" "}
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                  }}
                                >
                                  {tx.from || "-"}
                                </span>
                              </div>
                            )}
                          </div>
                        </TxMeta>

                        <TxRight>
                          <div
                            style={{
                              fontWeight: 900,
                              fontSize: 18,
                              color: isSent(tx) ? "#ff6b6b" : "#7cf0a5",
                            }}
                          >
                            {isSent(tx) ? "-" : "+"}
                            {fmt(tx.amount)}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <StatusPill pending={tx.status === "pending"}>
                              {tx.status === "pending"
                                ? "Pending"
                                : "Success"}
                            </StatusPill>

                            <Btn
                              ghost
                              onClick={() =>
                                copy(tx.txid, "Tx ID copied!")
                              }
                              whileTap={{ scale: 0.95 }}
                            >
                              Copy ID
                            </Btn>
                          </div>
                        </TxRight>
                      </TxItem>
                    </div>
                  ))
                ) : (
                  <Small>No transactions yet.</Small>
                )}
              </TxListScroll>
            </TxBox>

          </div>
        </CardGrid>
      </Section>

      {/* SEND MODAL */}
      <AnimatePresence>
        {sendModal && (
          <ModalOverlay onClick={() => showSend(false)}>
            <ModalBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>Send PNT</h3>
                <FiX
                  size={22}
                  style={{ cursor: "pointer" }}
                  onClick={() => showSend(false)}
                />
              </div>

              <Small>Enter recipient address and amount.</Small>

              <div style={{ marginTop: 16 }}>
                <Small>Recipient</Small>
                <Input
                  value={form.to}
                  onChange={(e) =>
                    setForm({ ...form, to: e.target.value })
                  }
                  placeholder="0x... or wallet address"
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <Small>Amount</Small>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  placeholder="0.0000"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <Btn ghost onClick={() => showSend(false)} whileTap={{ scale: 0.95 }}>
                  Cancel
                </Btn>
                <Btn
                  onClick={sendTx}
                  disabled={sending}
                  style={{ opacity: sending ? 0.6 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sending ? "Sending..." : "Send"}
                </Btn>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* RECEIVE MODAL */}
      <AnimatePresence>
        {receiveModal && (
          <ModalOverlay onClick={() => showReceive(false)}>
            <ModalBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>Receive PNT</h3>
                <FiX
                  size={22}
                  style={{ cursor: "pointer" }}
                  onClick={() => showReceive(false)}
                />
              </div>

              <Small>Scan or share your deposit address.</Small>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <QRCodeCanvas
                  value={state.address || ""}
                  size={200}
                  fgColor="#00f5a0"
                  bgColor="#071221"
                />
              </div>

              <Mono style={{ marginTop: 20 }}>
                {state.address || "Not logged in"}
              </Mono>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 14,
                  justifyContent: "flex-end",
                }}
              >
                <Btn
                  ghost
                  onClick={() =>
                    copy(state.address, "Address copied!")
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  Copy
                </Btn>

                <Btn
                  ghost
                  onClick={() => {
                    if (navigator.share && state.address) {
                      navigator
                        .share({ text: state.address })
                        .catch(() => showToast("Share failed"));
                    } else {
                      showToast("Share not supported");
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share
                </Btn>

                <Btn
                  onClick={() => showReceive(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </Btn>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* TOAST */}
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
