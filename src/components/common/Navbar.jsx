import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import {
  FiHome,
  FiCreditCard,
  FiShoppingBag,
  FiShield,
  FiUsers,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Nav = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(8, 15, 35, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 245, 160, 0.2);
  z-index: 1000;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 65px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.9rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1001;
`;

// Ye naya wrapper — isse sab right pe flush ho jayega
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: rgba(5, 10, 30, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: flex-start;
    padding: 100px 2rem 2rem;
    gap: 1.8rem;
    transform: translateX(${props => (props.open ? "0" : "-100%")});
    transition: transform 0.4s cubic-bezier(0.6, -0.05, 0.1, 1);
    box-shadow: 8px 0 30px rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const NavItem = styled(Link)`
  color: #bfffe6;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 7px 10px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &.active {
    background: rgba(0, 245, 160, 0.18);
    color: #00f5a0;
    font-weight: 600;
    box-shadow: 0 0 15px rgba(0, 245, 160, 0.3);
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
    font-size: 1.15rem;
  }
`;

const ProfileSection = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background: rgba(0, 245, 160, 0.15);
  border: 1.5px solid rgba(0, 245, 160, 0.4);
  color: #00f5a0;
  padding: 11px 22px;
  border-radius: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0, 245, 160, 0.3);
    box-shadow: 0 0 25px rgba(0, 245, 160, 0.4);
    transform: translateY(-2px);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 78px;
  right: 0;
  background: rgba(10, 20, 40, 0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 245, 160, 0.3);
  border-radius: 16px;
  padding: 0.8rem 0;
  min-width: 260px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  opacity: ${props => (props.show ? 1 : 0)};
  visibility: ${props => (props.show ? "visible" : "hidden")};
  transform: translateY(${props => (props.show ? "0" : "-15px")});
  transition: all 0.35s ease;
  z-index: 1000;

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    border-radius: 20px;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 28px;
  color: #bfffe6;
  text-decoration: none;
  font-size: 0.98rem;
  transition: 0.3s;

  &:hover {
    background: rgba(0, 245, 160, 0.15);
    color: #00f5a0;
    padding-left: 35px;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 28px;
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 0.98rem;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 107, 107, 0.15);
    padding-left: 35px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #bfffe6;
  font-size: 1.9rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  display: ${props => (props.open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 998;
`;

// MAIN COMPONENT
const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const getUsername = () => {
    if (!user) return "User";
    if (user.name && typeof user.name === "string" && user.name.trim()) return user.name.trim();
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  return (
    <>
      <Nav>
        <Container>
          <Logo to="/">Quantum</Logo>

          {/* Ye khali div center ka space le lega → sab right pe chala jayega */}
          <div style={{ flexGrow: 1 }} />

          <RightSection>
            {/* Desktop Links */}
            <NavLinks open={menuOpen}>
              <NavItem to="/" className={location.pathname === "/" ? "active" : ""}>
                <FiHome /> Home
              </NavItem>

              {user ? (
                <>
                  <NavItem to="/dashboard" className={location.pathname.startsWith("/dashboard") ? "active" : ""}>
                    <FiShield /> Dashboard
                  </NavItem>
                  <NavItem to="/wallet" className={location.pathname === "/wallet" ? "active" : ""}>
                    <FiCreditCard /> Wallet
                  </NavItem>
                  <NavItem to="/marketplace" className={location.pathname === "/marketplace" ? "active" : ""}>
                    <FiShoppingBag /> Marketplace
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem to="/login">Login</NavItem>
                  <NavItem to="/register">Register</NavItem>
                </>
              )}
            </NavLinks>

            {/* User Dropdown */}
            {user && (
              <ProfileSection>
                <ProfileButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FiUser size={19} />
                  {getUsername()}
                </ProfileButton>

                <Dropdown show={dropdownOpen}>
                  <DropdownItem to="/profile">
                    <FiUser /> My Profile
                  </DropdownItem>
                  <DropdownItem to="/settings">
                    <FiSettings /> Settings
                  </DropdownItem>
                  <DropdownItem to="/kyc">
                    <FiCheckCircle /> KYC Verification
                  </DropdownItem>
                  <DropdownItem to="/trustcircle">
                    <FiUsers /> Trust Circle
                  </DropdownItem>
                  <LogoutButton onClick={() => { logout?.(); setDropdownOpen(false); }}>
                    <FiLogOut /> Logout
                  </LogoutButton>
                </Dropdown>
              </ProfileSection>
            )}
          </RightSection>

          {/* Mobile Menu */}
          <MobileMenuButton onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </Container>
      </Nav>

      <Overlay open={menuOpen} onClick={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;