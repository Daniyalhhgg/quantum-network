// ============================================================================
//  Quantum Wallet — Ultra-Polished Updated (Simple Alert Success)
//  Full single-file React component (code/react) — ready to drop in.
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
//  Styled Components
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
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:2rem;
  flex-wrap:wrap;
  gap:14px;
`;

const Brand = styled.div`
  display:flex;align-items:center;gap:12px;
`;

const BrandLogo = styled.div`
  width:46px;height:46px;
  border-radius:12px;
  background:linear-gradient(135deg,#00f5a0,#00d9f5);
  display:grid;place-items:center;
  font-size:20px;
  font-weight:900;
  color:#021728;
`;

const Title = styled.h1`
  margin:0;font-size:22px;font-weight:800;
`;

const CardGrid = styled.div`
  display:grid;
  grid-template-columns: 1fr 360px;
  gap:24px;

  @media (max-width:960px) {
    grid-template-columns:1fr;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(6px);
  border:1px solid rgba(255,255,255,0.05);
  padding:2rem;
  border-radius:22px;
  box-shadow:0 12px 40px rgba(0,0,0,0.35);
`;

const Amount = styled.div`
  font-size:48px;
  font-weight:900;
  background:linear-gradient(90deg,#00f5a0,#00e5f5);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
`;

const Small = styled.small`
  font-size:13px;
  color:#9fb6c3;
`;

const Btn = styled(motion.button)`
  border:none;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:10px;
  padding:12px 16px;
  border-radius:14px;
  font-size:14px;
  font-weight:700;
  transition:0.25s;

  background: ${(p) => (p.ghost ? "rgba(255,255,255,0.03)" : "linear-gradient(90deg,#00f5a0,#00e5f5)")};
  color: ${(p) => (p.ghost ? "#e6f7f5" : "#04201b")};
  border: ${(p) => (p.ghost ? "1px solid rgba(255,255,255,0.05)" : "none")};

  &:hover {
    opacity:0.85;
  }
`;

const AddressBox = styled.div`
  background:rgba(0,0,0,0.32);
  padding:14px;
  border-radius:12px;
  border:1px dashed rgba(0,245,160,0.2);
  text-align:center;
`;

const Mono = styled.code`
  font-size:14px;
  word-break:break-all;
  display:block;
  padding:10px;
  margin-top:8px;
  border-radius:10px;
  background:#020b1d;
  color:#00f5a0;
`;

const TxBox = styled.div`
  margin-top:20px;
`;

const TxListScroll = styled.div`
  max-height: 340px; /* fixed height for scroll */
  overflow-y: auto;
  padding-right: 8px; /* give space for scrollbar */
  margin-top:12px;
`;

const TxItem = styled.div`
  background:rgba(255,255,255,0.02);
  padding:14px;
  border-radius:12px;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  border-left:5px solid ${(p)=>p.sent ? "#ff6b6b" : "#2ed573"};
`;

const TxMeta = styled.div`
  display:flex;
  flex-direction:column;
  gap:6px;
`;

const TxRight = styled.div`
  display:flex;
  flex-direction:column;
  gap:8px;
  align-items:flex-end;
`;

const StatusPill = styled.div`
  font-size:12px;
  padding:6px 8px;
  border-radius:999px;
  background: ${(p)=> p.pending ? "rgba(255,195,195,0.07)" : "rgba(196,255,227,0.06)"};
  border: 1px solid ${(p)=> p.pending ? "rgba(255,110,110,0.12)" : "rgba(46,213,115,0.08)"};
  color: ${(p)=> p.pending ? "#ff6b6b" : "#7cf0a5"};
  font-weight:700;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display:grid;
  place-items:center;
  z-index:2000;
  padding:20px;
`;

const ModalBox = styled(motion.div)`
  width:100%;
  max-width:520px;
  background:#091321;
  padding:20px;
  border-radius:20px;
  border:1px solid rgba(0,245,160,0.1);
`;

const Input = styled.input`
  padding:12px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,0.06);
  background:#071221;
  color:#e8f8f4;
  font-size:14px;
  width:100%;
  outline:none;
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  });

// safe parse token
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
    pendingBalance: 0,
    totalBalance: 0,
    address: "",
    transactions: [],
    kycStatus: "not_submitted",
  });

  const [sendModal, showSend] = useState(false);
  const [receiveModal, showReceive] = useState(false);
  const [form, setForm] = useState({ to: "", amount: "" });
  const [sending, setSending] = useState(false);
  const mounted = useRef(true);

  // fetch token once
  const token = getToken();

  // copy helper with graceful message
  const copy = async (text, msg = "Copied!") => {
    if (!text) return alert("Nothing to copy");
    try {
      await navigator.clipboard.writeText(text);
      alert(msg);
    } catch {
      // fallback: select and prompt
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        alert(msg);
      } catch {
        alert("Copy failed");
      }
    }
  };

  const isSent = (tx) =>
    tx?.from && state?.address && tx.from.toLowerCase() === state.address.toLowerCase();

  // Fetch wallet data
  const loadWallet = async () => {
    if (!token) return setState((s) => ({ ...s, loading: false }));
    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const { data } = await api.get("/wallet/info");

      // Normalize transactions: ensure date, txid/hash, from/to, status
      const txs = (data.transactions || []).map((t) => ({
        date: t.date || t.timestamp || new Date().toISOString(),
        amount: t.amount ?? t.value ?? 0,
        from: t.from || t.sender || "",
        to: t.to || t.recipient || "",
        txid: t.txid || t.hash || t.id || "",
        status: (t.status || t.state || "success").toLowerCase(),
      }));

      if (!mounted.current) return;
      setState({ loading: false, ...data, transactions: txs });
    } catch (err) {
      console.error("loadWallet error", err?.response || err.message || err);
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

  // Send transaction
  const sendTx = async () => {
    if (!form.to || !form.amount) return alert("Enter address & amount");

    try {
      setSending(true);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      const payload = { to: form.to.trim(), amount: Number(form.amount) };
      const { data } = await api.post("/wallet/send", payload);

      // the server ideally returns the created tx or status
      alert("Transaction submitted!"); // simple alert (you asked A)

      showSend(false);
      setForm({ to: "", amount: "" });

      // reload wallet to reflect new tx
      loadWallet();

      // if server gives immediate tx object and optimistic update desired
      if (data?.tx) {
        setState((s) => ({ ...s, transactions: [
          {
            date: data.tx.date || new Date().toISOString(),
            amount: data.tx.amount || payload.amount,
            from: data.tx.from || s.address || "",
            to: data.tx.to || payload.to,
            txid: data.tx.txid || data.tx.hash || "",
            status: (data.tx.status || "pending").toLowerCase(),
          },
          ...s.transactions,
        ] }));
      }

    } catch (e) {
      console.error("sendTx error", e?.response || e?.message || e);
      alert(e?.response?.data?.message || "Transaction failed");
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
            <BrandLogo>QW</BrandLogo>
            <div>
              <Title>Quantum Wallet</Title>
              <Small>Non-custodial · Secure · Web3-Ready</Small>
            </div>
          </Brand>

          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn ghost onClick={loadWallet}><FiRefreshCw/> Refresh</Btn>
            <Btn onClick={() => showReceive(true)}><FiDownload/> Receive</Btn>
            <Btn onClick={() => showSend(true)}><FiSend/> Send</Btn>
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
                  <Small>Total Balance</Small>
                  <Amount>{fmt(state.totalBalance)} QNT</Amount>

                  <div style={{marginTop:10,display:'flex',alignItems:'center',gap:10}}>
                    <Btn ghost style={{padding:"6px 12px"}}>
                      <FiShield/> {state.kycStatus === "approved" ? "KYC Verified" : "Limited Access"}
                    </Btn>

                  
                  </div>
                </div>

                <div>
                  <Small>Available</Small>
                  <div style={{ fontSize:20, fontWeight:800 }}>
                    {fmt(state.balance)} QNT
                  </div>
                  <Small>
                    ≈ {(state.totalBalance * 0.0).toLocaleString(undefined, {
                      style:"currency", currency:"USD"
                    })}
                  </Small>
                </div>
              </>
            )}
          </Card>

          {/* Address & Transactions */}
          <div>

            <AddressBox>
              <Small>Your Address</Small>
              <Mono>{state.address || "Not logged in"}</Mono>

              <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:10}}>
                <Btn ghost onClick={() => copy(state.address, "Address copied!")}>
                  <FiCopy/> Copy
                </Btn>
                <Btn ghost onClick={() => showReceive(true)}>
                  <FiDownload/> QR
                </Btn>
              </div>
            </AddressBox>

            {/* Tx history box (single scrollable box) */}
            <TxBox>
              <Small>Recent Activity</Small>
              <TxListScroll>
                {state.transactions?.length ? (
                  state.transactions.map((tx,i)=>(
                    <div key={i} style={{marginBottom:12}}>
                      <TxItem sent={isSent(tx)}>
                        <TxMeta>
                          <div style={{fontWeight:800}}>
                            {isSent(tx) ? "Sent" : "Received"}
                          </div>
                          <Small>{new Date(tx.date).toLocaleString()}</Small>

                          {/* show counterparty address */}
                          <div style={{marginTop:6,fontSize:13,color:'#bfe9d9'}}>
                            {isSent(tx) ? (
                              <div>To: <span style={{fontFamily:'monospace',fontWeight:700}}>{tx.to || "-"}</span></div>
                            ) : (
                              <div>From: <span style={{fontFamily:'monospace',fontWeight:700}}>{tx.from || "-"}</span></div>
                            )}
                          </div>
                        </TxMeta>

                        <TxRight>
                          <div style={{
                            fontWeight:900, fontSize:18,
                            color: isSent(tx) ? "#ff6b6b" : "#7cf0a5"
                          }}>
                            {isSent(tx) ? "-" : "+"}{fmt(tx.amount)}
                          </div>

                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            <StatusPill pending={tx.status === 'pending'}>
                              {tx.status === 'pending' ? 'Pending' : 'Success'}
                            </StatusPill>

                            <Btn ghost onClick={() => copy(tx.txid || tx.hash || tx.txid, "Tx ID copied!") }>
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

      {/* ========================= SEND MODAL ========================= */}
      <AnimatePresence>
      {sendModal && (
        <ModalOverlay>
          <ModalBox
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0, scale:0.9 }}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h3>Send QNT</h3>
              <FiX size={22} style={{cursor:"pointer"}} onClick={()=>showSend(false)}/>
            </div>

            <Small>Enter recipient address and amount.</Small>

            <div style={{marginTop:16}}>
              <Small>Recipient</Small>
              <Input value={form.to} onChange={e=>setForm({...form,to:e.target.value})} placeholder="0x... or wallet address"/>
            </div>

            <div style={{marginTop:16}}>
              <Small>Amount</Small>
              <Input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.0000"/>
            </div>

            <div style={{display:"flex",justifyContent:"flex-end",gap:12,marginTop:20}}>
              <Btn ghost onClick={()=>showSend(false)}>Cancel</Btn>
              <Btn onClick={sendTx} disabled={sending} style={{opacity: sending ? 0.6 : 1}}>
                {sending ? "Sending..." : "Send"}
              </Btn>
            </div>
          </ModalBox>
        </ModalOverlay>
      )}
      </AnimatePresence>

      {/* ========================= RECEIVE MODAL ========================= */}
      <AnimatePresence>
      {receiveModal && (
        <ModalOverlay>
          <ModalBox
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0, scale:0.9 }}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h3>Receive QNT</h3>
              <FiX size={22} style={{cursor:"pointer"}} onClick={()=>showReceive(false)}/>
            </div>

            <Small>Scan or share your deposit address.</Small>

            <div style={{marginTop:20,textAlign:"center"}}>
              <QRCodeCanvas
                value={state.address || ""
                }
                size={200}
                fgColor="#00f5a0"
                bgColor="#071221"
              />
            </div>

            <Mono style={{marginTop:20}}>{state.address || "Not logged in"}</Mono>

            <div style={{display:"flex",gap:10,marginTop:14,justifyContent:"flex-end"}}>
              <Btn ghost onClick={()=>copy(state.address)}>Copy</Btn>
              <Btn ghost onClick={()=>{
                if (navigator.share && state.address) navigator.share({ text: state.address });
                else alert('Share not supported in this browser');
              }}>Share</Btn>
              <Btn onClick={()=>showReceive(false)}>Close</Btn>
            </div>

          </ModalBox>
        </ModalOverlay>
      )}
      </AnimatePresence>

    </Page>
  );
}