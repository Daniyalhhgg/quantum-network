// Navbar.jsx - UPDATED VERSION (HOME hidden after login - FIXED)

import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import {
  FiHome, FiCreditCard, FiShoppingBag, FiShield, FiUsers,
  FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiCheckCircle,FiMail,
} from "react-icons/fi";

/* -------------------- ANIMATIONS -------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* -------------------- QUANTUM LOGO COMPONENT (REUSABLE) -------------------- */
const QuantumLogo = ({ size = 46, showText = true, floating = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: showText ? '11px' : '0',
    position: floating ? 'relative' : 'static'
  }}>
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: floating ? '0 12px 32px rgba(0,245,160,0.6)' : '0 0 30px rgba(0,245,160,0.5)',
      position: 'relative',
      overflow: 'hidden',
      border: floating ? '5px solid rgba(8,15,35,0.98)' : 'none',
      zIndex: floating ? 10 : 'auto'
    }}>
      <svg width={size * 0.76} height={size * 0.76} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(32,32)">
          <circle cx="0" cy="0" r="28" stroke="#0b132b" strokeWidth="4"/>
          <circle cx="0" cy="0" r="28" stroke="url(#grad1)" strokeWidth="3" opacity="0.85"/>
          
          <path d="M -10 -12 L -10 -4 Q -10 2, -4 6 Q 2 10, 10 6 L 10 -12 M 4 -6 L 10 -12" 
                stroke="#0b132b" strokeWidth="6" strokeLinecap="round"/>
          
          <circle cx="20" cy="0" r="3" fill="#00f5a0">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="-14" cy="14" r="2.5" fill="#00d9f5">
            <animate attributeName="opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="0" cy="-20" r="2" fill="#00f5a0">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite"/>
          </circle>
        </g>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5a0"/>
            <stop offset="100%" stopColor="#00d9f5"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    {showText && (
      <span style={{
        fontSize: '1.75rem',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        background: 'linear-gradient(90deg, #00f5a0, #00d9f5)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Pytro Network
      </span>
    )}
  </div>
);

/* -------------------- STYLED COMPONENTS -------------------- */
const NAV_HEIGHT = 72;
const MOBILE_BREAK = "768px";

const Nav = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  height: ${NAV_HEIGHT}px;
  display: flex;
  align-items: center;
  background: rgba(8, 15, 35, 0.95);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(0, 245, 160, 0.12);
  z-index: 1100;
  animation: ${fadeIn} 0.35s ease;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Spacer = styled.div`flex: 1 1 auto;`;
const Right = styled.div`display: flex; align-items: center; gap: 1rem;`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  @media (max-width: ${MOBILE_BREAK}) { display: none; }
`;

const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #bfffe6;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.98rem;
  transition: all 0.18s ease;
  &.active {
    color: #00f5a0;
    background: rgba(0, 245, 160, 0.08);
    box-shadow: 0 6px 18px rgba(0, 245, 160, 0.06);
    font-weight: 600;
  }
  &:hover:not(.active) {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.04);
  }
`;

const MobileToggle = styled.button`
  display: none;
  @media (max-width: ${MOBILE_BREAK}) { display: inline-flex; }
  background: none; border: none; color: #bfffe6; font-size: 1.6rem;
  padding: 8px; border-radius: 10px; cursor: pointer;
`;

const MobileDrawer = styled.aside`
  position: fixed; top: 0; left: 0; width: 86%; max-width: 360px; height: 100vh;
  background: linear-gradient(180deg, rgba(5,10,25,0.98), rgba(7,12,30,0.98));
  backdrop-filter: blur(18px); box-shadow: 10px 0 40px rgba(0,0,0,0.6);
  transform: translateX(${p => p.open ? "0" : "-110%"});
  transition: transform 300ms cubic-bezier(.22,1,.36,1);
  z-index: 1200; padding: ${NAV_HEIGHT + 18}px 20px 20px 20px;
  display: flex; flex-direction: column; gap: 12px;
  @media (min-width: ${MOBILE_BREAK}) { display: none; }
`;

const DrawerLink = styled(Link)`
  color: #bfffe6; text-decoration: none; font-size: 1.1rem;
  padding: 14px 10px; border-radius: 12px; display: flex; gap: 12px;
  align-items: center; transition: background 0.18s ease;
  &:hover { background: rgba(0,245,160,0.06); color: #00f5a0; }
`;

const Overlay = styled.div`
  display: ${p => p.show ? "block" : "none"};
  position: fixed; inset: 0; background: rgba(0,0,0,0.56);
  backdrop-filter: blur(4px); z-index: 1150;
`;

const ProfileWrap = styled.div`position: relative;`;
const ProfileBtn = styled.button`
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(0,245,160,0.12); border: 1px solid rgba(0,245,160,0.18);
  color: #00f5a0; padding: 8px 14px; border-radius: 16px; font-weight: 600;
  cursor: pointer; transition: transform .18s ease, box-shadow .18s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,245,160,0.06); }
  @media (max-width: ${MOBILE_BREAK}) { display: none; }
`;

const Dropdown = styled.div`
  position: absolute; right: 0; top: calc(${NAV_HEIGHT}px + 8px);
  min-width: 260px; background: rgba(8,16,32,0.98); border-radius: 12px;
  border: 1px solid rgba(0,245,160,0.08); box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  padding: 8px 0; opacity: ${p => p.show ? 1 : 0};
  transform: translateY(${p => p.show ? "0" : "-12px"});
  visibility: ${p => p.show ? "visible" : "hidden"};
  transition: all 180ms ease; z-index: 1250;
`;

const DropdownItem = styled(Link)`
  display: flex; align-items: center; gap: 12px; color: #bfffe6;
  padding: 12px 16px; text-decoration: none; font-size: 0.98rem;
  &:hover { background: rgba(0,245,160,0.06); color: #00f5a0; padding-left: 22px; transition: padding-left .18s; }
`;

const Logout = styled.button`
  width: 100%; background: none; border: none; text-align: left;
  padding: 12px 16px; color: #ff7b7b; cursor: pointer;
  &:hover { background: rgba(255,107,107,0.06); padding-left: 22px; transition: padding-left .18s; }
`;

const Divider = styled.hr`
  border: none; height: 1px; background: rgba(255,255,255,0.03); margin: 6px 0;
`;

/* ==================== MOBILE BOTTOM NAV WITH CENTER LOGO ==================== */

const MobileBottomNav = styled.div`
  display: none;
  @media (max-width: ${MOBILE_BREAK}) {
    display: flex;
    position: fixed;
    bottom: 0; 
    left: 6px;   /* slightly inset from left */
    right: 6px;  /* slightly inset from right */
    height: 48px;
    background: rgba(8, 15, 35, 0.98);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0, 245, 160, 0.15);
    z-index: 1000;
    padding: 4px 0;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.4);
    align-items: center;
    justify-content: space-around;
  }
`;

const FooterNavItem = styled(Link)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: ${p => p.active ? "#00f5a0" : "#6ab8a2"};
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 400;
  transition: all 0.22s ease;
  position: relative;
  z-index: 2;

  svg { font-size: 1.5rem; transition: transform 0.22s ease; }

  ${p => p.active && `
    color: #00f5a0;
    svg { transform: translateY(-3px) scale(1.2); }
    &:before {
      content: '';
      position: absolute;
      top: 10px;
      width: 6px; height: 1px;
      background: #00f5a0;
      border-radius: 30%;
      box-shadow: 0 0 14px #00f5a0;
    }
  `}
`;

/* ==================== MAIN COMPONENT ==================== */
const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = user?.name?.trim() || user?.email?.split("@")[0] || "User";

  const isActiveFooter = (path) => {
    if (path === "/wallet") return location.pathname === "/wallet";
    if (path === "/kyc") return location.pathname.startsWith("/kyc");
    if (path === "/profile") return ["/profile", "/settings"].some(p => location.pathname.startsWith(p));
    return false;
  };

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => document.body.style.overflow = "";
  }, [drawerOpen]);

  useEffect(() => { setDrawerOpen(false); setDropdownOpen(false); }, [location]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && (setDrawerOpen(false), setDropdownOpen(false));
    const handleClick = (e) => dropdownRef.current && !dropdownRef.current.contains(e.target) && setDropdownOpen(false);
    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <>
      {/* TOP NAVBAR */}
      <Nav>
        <Container>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <QuantumLogo size={48} />
          </Link>
          <Spacer />

          <DesktopNav>
            {/* Home link - ONLY SHOW WHEN USER IS NOT LOGGED IN */}
            {!user && (
              <NavLink to="/" className={location.pathname === "/" ? "active" : ""}><FiHome /> Home</NavLink>
            )}
            
            {user ? (
              <>
                <NavLink to="/dashboard" className={location.pathname.startsWith("/dashboard") ? "active" : ""}><FiShield /> Dashboard</NavLink>
                <NavLink to="/wallet" className={location.pathname === "/wallet" ? "active" : ""}><FiCreditCard /> Wallet</NavLink>
                <NavLink to="/marketplace" className={location.pathname === "/marketplace" ? "active" : ""}><FiShoppingBag /> Marketplace</NavLink>
              </>
            ) : (
              <>
                {/* Login/Register - only shown when user is NOT logged in */}
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </DesktopNav>

          <Right>
            {user && (
              <ProfileWrap ref={dropdownRef}>
                <ProfileBtn onClick={() => setDropdownOpen(s => !s)}>
                  <FiUser /> {username}
                </ProfileBtn>
                <Dropdown show={dropdownOpen}>
                  <DropdownItem to="/profile"><FiUser /> My Profile</DropdownItem>
                  {/* SETTINGS moved to dropdown only - removed from navbar */}
                  <DropdownItem to="/kyc"><FiCheckCircle /> KYC Verification</DropdownItem>
                  <DropdownItem to="/trustcircle"><FiUsers /> Trust Circle</DropdownItem>
                  <DropdownItem to="/ContactUs"><FiMail /> Contact Us</DropdownItem>
                  <Divider />
                  <Logout onClick={() => { logout?.(); setDropdownOpen(false); }}>
                    <FiLogOut /> Logout
                  </Logout>
                </Dropdown>
              </ProfileWrap>
            )}

            <MobileToggle onClick={() => setDrawerOpen(s => !s)}>
              {drawerOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </MobileToggle>
          </Right>
        </Container>
      </Nav>

      {/* MOBILE DRAWER */}
      <Overlay show={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <MobileDrawer open={drawerOpen}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <QuantumLogo size={46} />
          </Link>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: "#bfffe6", fontSize: 26, cursor: "pointer" }}>
            <FiX />
          </button>
        </div>
        
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 6px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#bfffe6", fontWeight: 700 }}>{username}</div>
              <div style={{ color: "rgba(191,255,230,0.7)", fontSize: 13 }}>{user.email ?? ""}</div>
            </div>
            <button onClick={() => { logout?.(); setDrawerOpen(false); }} style={{ background: "rgba(255,107,107,0.08)", color: "#ff7b7b", border: "1px solid rgba(255,107,107,0.12)", padding: "8px 12px", borderRadius: 10, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, padding: "8px 6px" }}>
            <DrawerLink to="/login">Login</DrawerLink>
            <DrawerLink to="/register">Register</DrawerLink>
          </div>
        )}

        <Divider />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Home is ONLY shown in mobile drawer when user is NOT logged in */}
          {!user && <DrawerLink to="/" onClick={() => setDrawerOpen(false)}><FiHome /> Home</DrawerLink>}
          
          {user && (
            <>
              <DrawerLink to="/dashboard" onClick={() => setDrawerOpen(false)}><FiShield /> Dashboard</DrawerLink>
              <DrawerLink to="/wallet" onClick={() => setDrawerOpen(false)}><FiCreditCard /> Wallet</DrawerLink>
              <DrawerLink to="/marketplace" onClick={() => setDrawerOpen(false)}><FiShoppingBag /> Marketplace</DrawerLink>
              <Divider />
              <DrawerLink to="/profile" onClick={() => setDrawerOpen(false)}><FiUser /> My Profile</DrawerLink>
              <DrawerLink to="/kyc" onClick={() => setDrawerOpen(false)}><FiCheckCircle /> KYC Verification</DrawerLink>
              <DrawerLink to="/trustcircle" onClick={() => setDrawerOpen(false)}><FiUsers /> Trust Circle</DrawerLink>
              <DrawerLink to="/ContactUs" onClick={() => setDrawerOpen(false)}><FiMail /> Contact Us</DrawerLink>
            </>
          )}
        </div>
        <div style={{ marginTop: "auto", fontSize: 13, color: "rgba(191,255,230,0.6)" }}>
          <Divider />
          <div style={{ padding: "8px 4px" }}>© {new Date().getFullYear()} Pytro — Secure · Fast · Simple</div>
        </div>
      </MobileDrawer>

      {/* MOBILE BOTTOM NAV - Only shown when user is logged in */}
      {user && (
        <MobileBottomNav>
          <FooterNavItem to="/dashboard" active={isActiveFooter("/dashboard")}>
            <FiShield /> Dashboard
          </FooterNavItem>

          <FooterNavItem to="/profile" active={isActiveFooter("/profile")}>
            <FiUser /> Profile
          </FooterNavItem> 
          
          <FooterNavItem to="/wallet" active={isActiveFooter("/wallet")}>
            <FiCreditCard /> Wallet
          </FooterNavItem>
          
          <FooterNavItem to="/kyc" active={isActiveFooter("/kyc")}>
            <FiCheckCircle /> KYC
          </FooterNavItem>
        </MobileBottomNav>
      )}
    </>
  );
};

export default Navbar;