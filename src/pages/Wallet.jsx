import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// ===== Animations =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px #00f5a0; }
  50% { box-shadow: 0 0 20px #00d9f5; }
  100% { box-shadow: 0 0 5px #00f5a0; }
`;

// ===== Styled Components =====
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #081225, #0b132b);
  color: #fff;
  padding: 3rem 1.5rem 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.8s ease;
  font-family: "Inter", sans-serif;
`;

const Title = styled(motion.h2)`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 950px;
  margin-bottom: 2.5rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(0, 245, 160, 0.15);
  backdrop-filter: blur(8px);
  animation: ${glow} 3s infinite;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #00f5a0;
  margin-bottom: 0.5rem;
`;

const CardValue = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  color: #bfffe6;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1.2rem;
  color: #0b132b;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 245, 160, 0.5);
  }
`;

const TransactionList = styled.div`
  width: 100%;
  max-width: 850px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const TransactionCard = styled(motion.div)`
  background: rgba(15, 25, 40, 0.9);
  border-left: 5px solid ${({ type }) => (type === "sent" ? "#ff4d6d" : "#00f5a0")};
  padding: 1rem 1.5rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Modal = styled(motion.div)`
  background: #0b132b;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #00f5a0;
  box-shadow: 0 0 20px rgba(0,245,160,0.3);
`;

const Input = styled.input`
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #00f5a0;
  background: #0b132b;
  color: #fff;
`;

const AddressBox = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(0, 245, 160, 0.15);
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  font-family: monospace;
  word-break: break-all;
  color: #bfffe6;
  text-align: center;
  margin-top: 0.5rem;
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: transparent;
  color: #00f5a0;
  border: none;
  cursor: pointer;
  font-size: 1rem;
`;

const SecondaryNote = styled.div`
  font-size: 0.8rem;
  color: #9fb7c7;
  margin-top: 0.5rem;
`;

// ===== Wallet Component =====
const Wallet = () => {
  const [balance, setBalance] = useState(parseFloat(localStorage.getItem("balance") || "0"));
  const [pending, setPending] = useState(parseFloat(localStorage.getItem("pendingBalance") || "0"));
  const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem("txs") || "[]"));
  const [modalOpen, setModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [kycStatus, setKycStatus] = useState(localStorage.getItem("kycStatus") || "not_submitted");

  // Fetch or generate wallet address
  useEffect(() => {
    let saved = localStorage.getItem("walletAddress");
    if (!saved) {
      saved = "QNT-" + Math.random().toString(36).substring(2, 12).toUpperCase();
      localStorage.setItem("walletAddress", saved);
    }
    setAddress(saved);
  }, []);

  // Sync balance & pending every second
  useEffect(() => {
    const interval = setInterval(() => {
      const storedBalance = parseFloat(localStorage.getItem("balance") || "0");
      const storedPending = parseFloat(localStorage.getItem("pendingBalance") || "0");
      const storedKYC = localStorage.getItem("kycStatus") || "not_submitted";

      setBalance(storedBalance);
      setPending(storedPending);
      setKycStatus(storedKYC);

      // Auto-transfer pending to balance when KYC approved
      if (storedKYC === "approved" && storedPending > 0) {
        const total = storedBalance + storedPending;
        localStorage.setItem("balance", total.toString());
        localStorage.setItem("pendingBalance", "0");
        setBalance(total);
        setPending(0);
        alert(`✅ ${storedPending} pending tokens moved to your wallet after KYC approval.`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Send tokens
  const handleSend = () => {
    if (!recipient || !amount || parseFloat(amount) > balance) {
      alert("⚠️ Invalid recipient or amount!");
      return;
    }
    const tx = { id: Date.now(), to: recipient, amount: parseFloat(amount), type: "sent", date: new Date().toLocaleString() };
    const newTx = [tx, ...transactions];
    setTransactions(newTx);
    localStorage.setItem("txs", JSON.stringify(newTx));

    const newBalance = balance - parseFloat(amount);
    setBalance(newBalance);
    localStorage.setItem("balance", newBalance.toString());

    setRecipient("");
    setAmount("");
    setModalOpen(false);
    alert("✅ Transaction sent!");
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    alert("📋 Address copied!");
  };

  return (
    <Container>
      <Title initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        💎 Quantum Wallet
      </Title>

      <CardGrid>
        <Card whileHover={{ scale: 1.05 }}>
          <CardTitle>Total Balance</CardTitle>
          <CardValue>{balance.toFixed(3)} QNT</CardValue>
          {pending > 0 && <SecondaryNote>Pending Tokens: {pending.toFixed(3)}</SecondaryNote>}
        </Card>

        <Card whileHover={{ scale: 1.05 }}>
          <CardTitle>Send Tokens</CardTitle>
          <Button onClick={() => setModalOpen(true)}>Transfer</Button>
        </Card>

        <Card whileHover={{ scale: 1.05 }}>
          <CardTitle>Receive Tokens</CardTitle>
          <AddressBox>
            {address}
            <CopyButton onClick={copyAddress}>📋</CopyButton>
          </AddressBox>
          <SecondaryNote>Share this address to receive QNT</SecondaryNote>
        </Card>
      </CardGrid>

      <h3 style={{ color: "#00f5a0" }}>Recent Transactions</h3>
      <TransactionList>
        {transactions.length === 0 && <p style={{ textAlign: "center", color: "#9fb7c7" }}>No transactions yet.</p>}
        {transactions.map(tx => (
          <TransactionCard key={tx.id} type={tx.type} whileHover={{ scale: 1.02 }}>
            <span>{tx.type === "sent" ? `To: ${tx.to}` : `From: ${tx.to}`}</span>
            <span>{tx.amount.toFixed(3)} QNT</span>
          </TransactionCard>
        ))}
      </TransactionList>

      {modalOpen && (
        <ModalOverlay>
          <Modal initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <h3 style={{ color: "#00f5a0" }}>Send QNT</h3>
            <Input placeholder="Recipient address" value={recipient} onChange={e => setRecipient(e.target.value)} />
            <Input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <Button onClick={handleSend}>Send</Button>
            <Button onClick={() => setModalOpen(false)} style={{ background: "#ff4d6d" }}>Cancel</Button>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Wallet;
