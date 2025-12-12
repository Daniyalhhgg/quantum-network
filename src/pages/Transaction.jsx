// ============================================================================
// Blockchain Explorer — Public Transaction Viewer (Responsive Edition)
// ============================================================================
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FiSearch, FiRefreshCw, FiCopy } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

// Responsive Styles (Mobile-First)
const ExplorerPage = styled.div`
  min-height: 100vh;
  padding: 1.5rem 1rem;
  color: #e9f6f1;
  background: linear-gradient(180deg, #091121 0%, #0c1323 100%);
  font-family: 'Inter', sans-serif;
`;

const ExplorerSection = styled(motion.section)`
  max-width: 1200px;
  margin: 0 auto;
`;

const ExplorerHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ExplorerTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  margin: 0;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #071221;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 8px 12px;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #e9f6f1;
  font-size: 14px;
  outline: none;
`;

const TxTable = styled.div`
  overflow-x: auto;
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.05);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1rem;
  font-weight: 700;
  font-size: 13px;
  color: #9fb6c3;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0,245,160,0.15);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 640px) {
    display: none; // Mobile pe headers hide, row mein labels
  }
`;

const TxRow = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  align-items: center;

  &:last-child { border-bottom: none; }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(0,0,0,0.2);
    border-radius: 12px;
    margin-bottom: 1rem;
  }
`;

const Cell = styled.div`
  font-size: 13px;
  word-break: break-all;
  color: ${(p) => p.color || "#e9f6f1"};

  @media (max-width: 640px) {
    display: flex;
    justify-content: space-between;
    &:before { content: attr(data-label) ": "; color: #9fb6c3; font-weight: 700; }
  }
`;

const StatusPill = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: ${(p) => (p.pending ? "rgba(255,100,100,0.1)" : "rgba(0,255,150,0.1)")};
  color: ${(p) => (p.pending ? "#ff6b6b" : "#2ed573")};
  font-weight: 700;
`;

const Btn = styled(motion.button)`
  padding: 6px 12px;
  border-radius: 10px;
  background: linear-gradient(90deg,#00f5a0,#00e5f5);
  color: #04201b;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PagBtn = styled.button`
  padding: 8px 16px;
  background: rgba(255,255,255,0.03);
  color: #e9f6f1;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  cursor: pointer;
  &:disabled { opacity: 0.5; }
`;

// Helpers
const fmt = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 });
const shorten = (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : "-";
const fmtTime = (date) => new Date(date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

// Component
export default function Explorer() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20; // Per page

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/explorer/transactions", {
        params: { page, limit, search: search.trim() || undefined },
      });
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTransactions();
    const id = setInterval(loadTransactions, 10000);
    return () => clearInterval(id);
  }, [page, search]);

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <ExplorerPage>
      <ExplorerSection initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ExplorerHeader>
          <ExplorerTitle>Blockchain Explorer</ExplorerTitle>
          <SearchBox>
            <FiSearch color="#9fb6c3" />
            <SearchInput
              placeholder="Search by Tx ID or Address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadTransactions()}
            />
            <Btn ghost onClick={loadTransactions}><FiRefreshCw /></Btn>
          </SearchBox>
        </ExplorerHeader>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <TxTable>
            <TableHeader>
              <Cell>Status</Cell>
              <Cell>Type</Cell>
              <Cell>From</Cell>
              <Cell>To</Cell>
              <Cell>Amount</Cell>
              <Cell>Fee</Cell>
              <Cell>Time</Cell>
              <Cell>Trx ID</Cell>
            </TableHeader>
            {transactions.map((tx, i) => (
              <TxRow key={i}>
                <Cell data-label="Status">
                  <StatusPill pending={tx.status === "pending"}>
                    {tx.status === "pending" ? "Pending" : "Success"}
                  </StatusPill>
                </Cell>
                <Cell data-label="Type">{tx.type || (tx.from ? "Sent" : "Received")}</Cell>
                <Cell data-label="From">{shorten(tx.from)}</Cell>
                <Cell data-label="To">{shorten(tx.to)}</Cell>
                <Cell data-label="Amount" color={tx.from ? "#ff6b6b" : "#2ed573"}>
                  {tx.from ? "-" : "+"}{fmt(tx.amount)} PNT
                </Cell>
                <Cell data-label="Fee">0 PNT</Cell>
                <Cell data-label="Time">{fmtTime(tx.date)}</Cell>
                <Cell data-label="Trx ID">
                  {shorten(tx.txid)}
                  <Btn ghost style={{ marginLeft: "8px" }} onClick={() => copy(tx.txid)}><FiCopy size={14} /></Btn>
                </Cell>
              </TxRow>
            ))}
          </TxTable>
        )}

        <Pagination>
          <PagBtn disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</PagBtn>
          <span>Page {page}</span>
          <PagBtn onClick={() => setPage(p => p + 1)}>Next</PagBtn>
        </Pagination>
      </ExplorerSection>
    </ExplorerPage>
  );
}
