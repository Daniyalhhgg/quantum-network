// src/pages/Marketplace.jsx → FINAL 100% WORKING VERSION (Toast Instead of Alert)
import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { FiSearch, FiTrendingUp, FiTrendingDown, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 10px #00f5a0; }
  50% { box-shadow: 0 0 25px #00d9f5; }
`;

// ======================= MAIN CONTAINER =======================
const Page = styled.section`
  min-height: 100vh;
  padding: 3rem 1.5rem 10rem;
  max-width: 1400px;
  margin: 0 auto;
  color: #fff;
  font-family: "Inter", sans-serif;
  background: radial-gradient(circle at top, #081225, #0b132b);
`;

// ======================= DATA MARKETPLACE SECTION =======================
const HeroTitle = styled.h1`
  text-align: center;
  font-size: 3rem;
  margin: 2rem 0 1rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5, #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeInUp} 0.8s ease;
`;

const HeroSubtitle = styled.p`
  text-align: center;
  font-size: 1.3rem;
  margin-bottom: 3rem;
  color: #bbb;
  animation: ${fadeInUp} 1s ease;
`;

const OptInButton = styled.button`
  display: block;
  margin: 3rem auto;
  padding: 16px 44px;
  font-size: 1.2rem;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: bold;
  color: #000;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  transition: all 0.4s;
  animation: ${glowPulse} 4s infinite;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,245,160,0.5);
  }
`;

const PartnersSection = styled.div`
  margin-top: 5rem;
  animation: ${fadeInUp} 1.2s ease;
`;

const PartnersTitle = styled.h2`
  text-align: center;
  font-size: 2.3rem;
  margin-bottom: 2.5rem;
  color: #00f5a0;
`;

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const PartnerCard = styled.div`
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,245,160,0.2);
  border-radius: 18px;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s;

  &:hover {
    transform: translateY(-10px);
    border-color: #00f5a0;
    box-shadow: 0 20px 40px rgba(0,245,160,0.25);
  }

  h3 {
    color: #00f5a0;
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  p {
    color: #ccc;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

// ======================= CRYPTO MARKET SECTION =======================
const CryptoSection = styled.div`
  margin-top: 7rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(0,245,160,0.25);
`;

const CryptoTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SearchBar = styled.div`
  max-width: 600px;
  margin: 0 auto 3rem;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(0,245,160,0.4);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  backdrop-filter: blur(10px);
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.1rem;
  outline: none;
  margin-left: 10px;
  &::placeholder { color: #777; }
`;

const CryptoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.5rem;
`;

const CryptoCard = styled.div`
  background: rgba(20, 30, 60, 0.7);
  border: 1px solid rgba(0,245,160,0.25);
  border-radius: 16px;
  padding: 1.3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00f5a0;
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0,245,160,0.3);
  }
`;

const CryptoIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(0,245,160,0.6);
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 1.15rem;
  color: #fff;
`;

const Symbol = styled.div`
  color: #88ffcc;
  font-size: 0.95rem;
  margin-top: 4px;
`;

const PriceBox = styled.div`
  text-align: right;
`;

const Price = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: #00f5a0;
`;

const Change = styled.div`
  font-size: 1rem;
  color: ${p => p.positive ? "#00f5a0" : "#ff4444"};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
  font-weight: 600;
`;

const LoadMoreBtn = styled.button`
  display: block;
  margin: 4rem auto;
  padding: 14px 40px;
  background: transparent;
  color: #00f5a0;
  border: 2px solid #00f5a0;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #00f5a0;
    color: #000;
  }
`;

// ======================= TOAST NOTIFICATION =======================
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

// ======================= MAIN COMPONENT =======================
export default function Marketplace() {
  const [showConsent, setShowConsent] = useState(false);
  const [opted, setOpted] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState(null); // NEW TOAST STATE

  const partners = [
    { name: "AdPartner", desc: "Audience insights (aggregated)" },
    { name: "ResearchCo", desc: "Anonymized engagement data" },
    { name: "MarketAI", desc: "Trend-based behavioral analytics" },
  ];

  // Toast Helper
  const showToast = (msg, duration = 2000) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  // Fetch Crypto Data
  const fetchCrypto = useCallback(async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: pageNum,
          price_change_percentage: "24h"
        }
      });

      const newCoins = pageNum === 1 ? res.data : [...cryptoData, ...res.data];
      setCryptoData(newCoins);
      setFiltered(newCoins);
      setHasMore(res.data.length === 50);
    } catch (err) {
      console.error("Crypto API Error:", err);
      showToast("Crypto market temporarily down");
    } finally {
      if (pageNum === 1) setLoading(false);
    }
  }, [cryptoData]);

  useEffect(() => {
    fetchCrypto(1);
    const interval = setInterval(() => fetchCrypto(1), 45000);
    return () => clearInterval(interval);
  }, []);

  // Search Filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(cryptoData);
    } else {
      const term = search.toLowerCase();
      setFiltered(cryptoData.filter(coin =>
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
      ));
    }
  }, [search, cryptoData]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchCrypto(next);
  };

  const handleConsent = (agree) => {
    setOpted(agree);
    setShowConsent(false);
    if (agree) {
      showToast("You have successfully joined Quantum Data Marketplace!");
    }
  };

  return (
    <Page>
      {/* DATA MARKETPLACE */}
      <div style={{ textAlign: "center" }}>
        <HeroTitle>Pytro Marketplace</HeroTitle>
        <HeroSubtitle>
          Monetize your anonymized data & earn PNT tokens passively
        </HeroSubtitle>
        <OptInButton onClick={() => setShowConsent(true)} whileTap={{ scale: 0.95 }}>
          {opted ? "Manage Consent" : "Opt-in & Start Earning"}
        </OptInButton>
      </div>

      <PartnersSection>
        <PartnersTitle>Trusted Partners</PartnersTitle>
        <PartnersGrid>
          {partners.map((p, i) => (
            <PartnerCard key={i}>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </PartnerCard>
          ))}
        </PartnersGrid>
      </PartnersSection>

      {/* LIVE CRYPTO MARKET */}
      <CryptoSection>
        <CryptoTitle>Live Crypto Market</CryptoTitle>

        <SearchBar>
          <FiSearch style={{ color: "#00f5a0", fontSize: "1.4rem" }} />
          <SearchInput
            type="text"
            placeholder="Search any coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => fetchCrypto(1)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FiRefreshCw style={{ color: "#00f5a0", fontSize: "1.3rem" }} />
          </button>
        </SearchBar>

        <CryptoGrid>
          {loading && cryptoData.length === 0 ? (
            [...Array(8)].map((_, i) => (
              <div key={i} style={{ height: "100px", background: "rgba(255,255,255,0.03)", borderRadius: "16px" }} />
            ))
          ) : (
            filtered.slice(0, page * 50).map(coin => (
              <CryptoCard key={coin.id}>
                <CryptoIcon src={coin.image} alt={coin.name} />
                <Info>
                  <Name>{coin.name}</Name>
                  <Symbol>{coin.symbol.toUpperCase()}</Symbol>
                </Info>
                <PriceBox>
                  <Price>
                    ${Number(coin.current_price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </Price>
                  <Change positive={coin.price_change_percentage_24h > 0}>
                    {coin.price_change_percentage_24h > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                  </Change>
                </PriceBox>
              </CryptoCard>
            ))
          )}
        </CryptoGrid>

        {hasMore && (
          <LoadMoreBtn onClick={loadMore} whileTap={{ scale: 0.95 }}>
            Load More Coins
          </LoadMoreBtn>
        )}
      </CryptoSection>

      {/* CONSENT MODAL */}
      {showConsent && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "rgba(11,19,43,0.98)", padding: "3rem", borderRadius: "20px",
            maxWidth: "90%", width: "440px", textAlign: "center",
            border: "2px solid #00f5a0", boxShadow: "0 0 50px rgba(0,245,160,0.5)"
          }}>
            <h2 style={{ color: "#00f5a0", fontSize: "1.8rem", marginBottom: "1rem" }}>
              Data Marketplace Consent
            </h2>
            <p style={{ color: "#ddd", lineHeight: "1.7", marginBottom: "2rem" }}>
              Your data is <strong>100% anonymized</strong>. Earn QNT by sharing engagement insights.
              You can revoke anytime.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button 
                onClick={() => handleConsent(true)} 
                style={{
                  padding: "14px 32px", background: "#00f5a0", color: "#000",
                  border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer"
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                onMouseUp={(e) => e.currentTarget.style.transform = ""}
              >
                Agree & Earn
              </button>
              <button 
                onClick={() => setShowConsent(false)} 
                style={{
                  padding: "14px 32px", background: "transparent", color: "#ff6b6b",
                  border: "2px solid #ff6b6b", borderRadius: "12px", cursor: "pointer"
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                onMouseUp={(e) => e.currentTarget.style.transform = ""}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
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