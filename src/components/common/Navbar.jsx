// src/components/common/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import {
  FiHome, FiCreditCard, FiShoppingBag, FiShield, FiUsers,
  FiUser, FiLogOut, FiMenu, FiX, FiCheckCircle, FiMail,
} from "react-icons/fi";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ==================== NEW PREMIUM PYTRO LOGO ==================== */
const PytroLogo = ({ size = 56, showText = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: showText ? '14px' : '0' }}>
    <svg width={size} height={size} viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
      <circle cx="160" cy="160" r="135" stroke="#2AA6FF" strokeWidth="3" fill="none" opacity="0.9">
        <animate attributeName="r" values="132;138;132" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite"/>
      </circle>

      <g stroke="#2AA6FF" strokeWidth="2.5" opacity="0.7">
        <line x1="160" y1="50" x2="230" y2="80"/>
        <line x1="230" y1="80" x2="270" y2="145"/>
        <line x1="270" y1="145" x2="240" y2="215"/>
        <line x1="240" y1="215" x2="160" y2="265"/>
        <line x1="160" y1="265" x2="80" y2="215"/>
        <line x1="80" y1="215" x2="50" y2="145"/>
        <line x1="50" y1="145" x2="90" y2="80"/>
        <line x1="90" y1="80" x2="160" y2="50"/>
      </g>

      <g fill="#2AA6FF">
        {[0,0.3,0.6,0.9,1.2,1.5,1.8,2.1].map((d,i) => {
          const pos = [[160,50],[230,80],[270,145],[240,215],[160,265],[80,215],[50,145],[90,80]];
          const [cx,cy] = pos[i];
          return <circle key={i} cx={cx} cy={cy} r="8">
            <animate attributeName="r" values="6;11;6" dur="3s" repeatCount="indefinite" begin={`${d}s`}/>
          </circle>
        })}
      </g>

      <circle cx="160" cy="160" r="80" fill="#0b1220"/>
      <text x="160" y="195" fontSize="160" fontFamily="Arial Black, Arial" fontWeight="900" fill="url(#gradP)" textAnchor="middle">P</text>

      <defs>
        <linearGradient id="gradP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4FC3FF"/>
          <stop offset="50%" stopColor="#00A3FF"/>
          <stop offset="100%" stopColor="#0072FF"/>
        </linearGradient>
      </defs>
    </svg>

    {showText && (
      <div style={{ lineHeight: 1 }}>
    <span style={{
  fontSize: '1.95rem',
  fontWeight: 900,
  letterSpacing: '-0.06em',
  background: 'linear-gradient(90deg,  #00f5a0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textDecoration: 'none',  // remove underline
  display: 'inline-block',  // ensures underline does not appear
}}>Pytro</span>

        <div style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          
          letterSpacing: '0.18em',
          marginTop: '-2px',
        }}></div>
      </div>
    )}
  </div>
);

/* ==================== ALL STYLED COMPONENTS (poora wala) ==================== */
const NAV_HEIGHT = 72;
const MOBILE_BREAK = "768px";

const Nav = styled.header`
  position: sticky; top: 0; width: 100%; height: ${NAV_HEIGHT}px;
  display: flex; align-items: center; background: rgba(8, 35, 25, 0.95);
  backdrop-filter: blur(14px); border-bottom: 1px solid rgba(42, 255, 124, 0.15);
  z-index: 1100; animation: ${fadeIn} 0.35s ease;
`;

const Container = styled.div`
  width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 1.25rem;
  display: flex; align-items: center; gap: 1rem;
`;

const Spacer = styled.div`flex: 1;`;
const Right = styled.div`display: flex; align-items: center; gap: 1rem;`;

const DesktopNav = styled.nav`
  display: flex; gap: 0.9rem;
  @media (max-width: ${MOBILE_BREAK}) { display: none; }
`;

const NavLink = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px; color: #bfffe6;
  text-decoration: none; font-weight: 500; padding: 8px 12px; border-radius: 10px;
  transition: all 0.2s;
  &.active, &:hover { color: #2AA6FF; background: rgba(42, 255, 138, 0.1); }
`;

const MobileToggle = styled.button`
  display: none; background: none; border: none; color: #bfffe6; font-size: 1.6rem; cursor: pointer;
  @media (max-width: ${MOBILE_BREAK}) { display: block; }
`;

const MobileDrawer = styled.aside`
  position: fixed; top: 0; left: 0; width: 86%; max-width: 360px; height: 100vh;
  background: linear-gradient(180deg, rgba(5,10,25,0.98), rgba(7,12,30,0.98));
  backdrop-filter: blur(18px); transform: translateX(${p => p.open ? 0 : "-100%"});
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); z-index: 1200;
  padding: ${NAV_HEIGHT + 20}px 20px 20px; display: flex; flex-direction: column; gap: 12px;
`;

const Overlay = styled.div`
  display: ${p => p.show ? "block" : "none"};
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1150;
`;

const ProfileWrap = styled.div`position: relative;`;
const ProfileBtn = styled.button`
  display: flex; align-items: center; gap: 10px; background: rgba(42,166,255,0.12);
  border: 1px solid rgba(42,166,255,0.2); color: #2AA6FF; padding: 8px 14px; border-radius: 16px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(42,166,255,0.2); }
  @media (max-width: ${MOBILE_BREAK}) { display: none; }
`;
/* ==================== MOBILE BOTTOM NAV ==================== */
const MobileBottomNav = styled.div`
  display: none;
  @media (max-width: ${MOBILE_BREAK}) {
    display: flex;
    position: fixed;
    bottom: 0; left: 6px; right: 6px;
    height: 48px; background: rgba(8, 35, 18, 0.98);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(42, 255, 88, 0.15);
    z-index: 1000; padding: 4px 0;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.4);
    align-items: center; justify-content: space-around;
  }
`;

const FooterNavItem = styled(Link)`
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; color: ${p => p.active ? "#2aff83ff" : "#6ab8a2"}; text-decoration: none;
  font-size: 0.7rem; font-weight: 400; transition: all 0.22s ease; position: relative; z-index: 2;

  svg { font-size: 1.5rem; transition: transform 0.22s ease; }

  ${p => p.active && `
    color: #2aff8aff;
    svg { transform: translateY(-3px) scale(1.2); }
    &:before {
      content: '';
      position: absolute;
      top: 10px;
      width: 6px; height: 1px;
      background: #2affadff;
      border-radius: 30%;
      box-shadow: 0 0 14px #2aff71ff;
    }
  `}
`;

const Dropdown = styled.div`
  position: absolute; right: 0; top: ${NAV_HEIGHT + 8}px; min-width: 240px;
  background: rgba(8,16,32,0.98); border-radius: 12px; border: 1px solid rgba(42,166,255,0.1);
  box-shadow: 0 20px 50px rgba(0,0,0,0.6); padding: 8px 0;
  opacity: ${p => p.show ? 1 : 0}; visibility: ${p => p.show ? "visible" : "hidden"};
  transform: translateY(${p => p.show ? 0 : "-10px"}); transition: all 0.2s; z-index: 1300;
`;

const DropdownItem = styled(Link)`
  display: flex; align-items: center; gap: 12px; color: #bfffe6; padding: 12px 20px;
  text-decoration: none; transition: all 0.2s;
  &:hover { background: rgba(42,166,255,0.1); color: #2AA6FF; padding-left: 26px; }
`;

const Logout = styled.button`
  width: 100%; text-align: left; padding: 12px 20px; background: none; border: none;
  color: #ff6b6b; cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(255,107,107,0.1); padding-left: 26px; }
`;

const Divider = styled.hr`
  border: none; height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0;
`;

/* ==================== MAIN NAVBAR ==================== */
const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = user?.name?.trim() || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <Nav>
        <Container>
          <Link to="/"><PytroLogo size={58} /></Link>
          <Spacer />

          <DesktopNav>
            {!user && <NavLink to="/" className={location.pathname === "/" ? "active" : ""}>Home</NavLink>}
            {user ? (
              <>
                <NavLink to="/dashboard" className={location.pathname.startsWith("/dashboard") ? "active" : ""}>Dashboard</NavLink>
                <NavLink to="/wallet" className={location.pathname === "/wallet" ? "active" : ""}>Wallet</NavLink>
                <NavLink to="/marketplace" className={location.pathname === "/marketplace" ? "active" : ""}>Marketplace</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </DesktopNav>

          <Right>
            {user && (
              <ProfileWrap ref={dropdownRef}>
                <ProfileBtn onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FiUser /> {username}
                </ProfileBtn>
                <Dropdown show={dropdownOpen}>
                  <DropdownItem to="/profile"><FiUser /> Profile</DropdownItem>
                  <DropdownItem to="/kyc"><FiCheckCircle /> KYC</DropdownItem>
                  <DropdownItem to="/trustcircle"><FiUsers /> Trust Circle</DropdownItem>
                  <DropdownItem to="/contactus"><FiMail /> Contact</DropdownItem>
                  <Divider />
                  <Logout onClick={logout}><FiLogOut /> Logout</Logout>
                </Dropdown>
              </ProfileWrap>
            )}

            <MobileToggle onClick={() => setDrawerOpen(!drawerOpen)}>
              {drawerOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </MobileToggle>
          </Right>
        </Container>
      </Nav>

      <Overlay show={drawerOpen} onClick={() => setDrawerOpen(false)} />
<MobileDrawer open={drawerOpen}>
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
    <Link to="/"><PytroLogo size={52} /></Link>
    <button onClick={() => setDrawerOpen(false)} style={{ background:"none", border:"none", color:"#bfffe6", fontSize:28, cursor:"pointer" }}>
      <FiX />
    </button>
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {!user && (
      <>
        <NavLink to="/" onClick={() => setDrawerOpen(false)} className={location.pathname === "/" ? "active" : ""}>Home</NavLink>
        <NavLink to="/login" onClick={() => setDrawerOpen(false)}>Login</NavLink>
        <NavLink to="/register" onClick={() => setDrawerOpen(false)}>Register</NavLink>
      </>
    )}
    {user && (
      <>
        <NavLink to="/dashboard" onClick={() => setDrawerOpen(false)} className={location.pathname.startsWith("/dashboard") ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/wallet" onClick={() => setDrawerOpen(false)} className={location.pathname === "/wallet" ? "active" : ""}>Wallet</NavLink>
        <NavLink to="/marketplace" onClick={() => setDrawerOpen(false)} className={location.pathname === "/marketplace" ? "active" : ""}>Marketplace</NavLink>

        <Divider />
        <DropdownItem to="/profile" onClick={() => setDrawerOpen(false)}><FiUser /> Profile</DropdownItem>
        <DropdownItem to="/kyc" onClick={() => setDrawerOpen(false)}><FiCheckCircle /> KYC</DropdownItem>
        <DropdownItem to="/trustcircle" onClick={() => setDrawerOpen(false)}><FiUsers /> Trust Circle</DropdownItem>
        <DropdownItem to="/contactus" onClick={() => setDrawerOpen(false)}><FiMail /> Contact</DropdownItem>
        <Logout onClick={() => { logout(); setDrawerOpen(false); }}><FiLogOut /> Logout</Logout>
      </>
    )}
  </div>
</MobileDrawer>
{/* MOBILE BOTTOM NAV - Only for logged-in users */}
{user && (
  <MobileBottomNav>
    <FooterNavItem to="/dashboard" active={location.pathname.startsWith("/dashboard")}>
      <FiShield /> Dashboard
    </FooterNavItem>
    <FooterNavItem to="/profile" active={location.pathname.startsWith("/profile")}>
      <FiUser /> Profile
    </FooterNavItem>
    <FooterNavItem to="/wallet" active={location.pathname === "/wallet"}>
      <FiCreditCard /> Wallet
    </FooterNavItem>
    <FooterNavItem to="/kyc" active={location.pathname.startsWith("/kyc")}>
      <FiCheckCircle /> KYC
    </FooterNavItem>
  </MobileBottomNav>
)}

    </>
  );
};

export default Navbar;