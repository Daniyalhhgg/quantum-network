import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../../context/AuthContext";

// ===== Animations =====
const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

// ===== Styled Components =====
const Nav = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 245, 160, 0.15);
  box-shadow: 0 2px 10px rgba(0, 245, 160, 0.05);
  animation: ${fadeInDown} 0.5s ease forwards;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.7rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.2s;
  z-index: 101;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 101;
  padding: 8px;
  margin: -8px;

  span {
    width: 24px;
    height: 2px;
    background: #bfffe6;
    border-radius: 3px;
    transition: 0.3s;
  }

  &.active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  &.active span:nth-child(2) {
    opacity: 0;
  }
  &.active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transition: 0.3s;

  a {
    color: #bfffe6;
    font-weight: 500;
    text-decoration: none;
    position: relative;
    transition: 0.25s;
    padding: 8px 4px;
    white-space: nowrap;

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      left: 0;
      bottom: -2px;
      background: #00f5a0;
      transition: width 0.3s;
    }

    &:hover::after,
    &.active::after {
      width: 100%;
    }
  }

  .user-controls {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-left: 1rem;

    .username {
      font-weight: 600;
      color: #00d9f5;
      white-space: nowrap;
    }

    button.logout {
      background: transparent;
      border: 1px solid #00f5a0;
      color: #00f5a0;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.25s;
      white-space: nowrap;

      &:hover {
        background: #00f5a0;
        color: #05101a;
        box-shadow: 0 0 10px rgba(0, 245, 160, 0.5);
      }
    }
  }

  /* ===== Mobile Styles ===== */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    max-width: 320px;
    height: 100vh;
    background: rgba(5, 10, 25, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 80px 1.5rem 2rem;
    gap: 1.3rem;
    transform: translateX(${(props) => (props.open ? "0" : "100%")});
    transition: transform 0.3s ease-in-out;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3);
    border-left: 1px solid rgba(0, 245, 160, 0.2);
    animation: ${slideInRight} 0.3s ease-out;
    overflow-y: auto;

    a {
      font-size: 1.1rem;
      padding: 10px 0;
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .user-controls {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
      margin-left: 0;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      width: 100%;

      .username {
        font-size: 1rem;
        color: #00d9f5;
        word-break: break-all;
      }

      button.logout {
        width: 100%;
        padding: 10px;
        font-size: 1rem;
      }
    }
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1.5rem 2rem;
  }
`;

const Overlay = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  z-index: 99;
  transition: opacity 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

// ===== Navbar Component =====
const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
  }, [menuOpen]);

  // === FIX: Safely extract username string ===
  const getUsername = () => {
    if (typeof user?.username === "string") return user.username;
    if (typeof user?.user?.username === "string") return user.user.username;
    if (typeof user?.username?.username === "string") return user.username.username;
    return "User";
  };

  const handleLogout = () => {
    logout?.();
    setMenuOpen(false);
  };

  return (
    <>
      <Nav>
        <Container>
          <Logo to="/" onClick={() => setMenuOpen(false)}>
            ⚛ Quantum
          </Logo>

          <MenuButton
            className={menuOpen ? "active" : ""}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </MenuButton>

          <NavLinks open={menuOpen}>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={location.pathname === "/dashboard" ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/wallet"
                  className={location.pathname === "/wallet" ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  Wallet
                </Link>
                <Link
                  to="/trustcircle"
                  className={location.pathname === "/trustcircle" ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  Trust Circle
                </Link>
                <Link
                  to="/marketplace"
                  className={location.pathname === "/marketplace" ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  to="/kyc"
                  className={location.pathname === "/kyc" ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  KYC
                </Link>

                <div className="user-controls">
                  <span className="username">Hi, {getUsername()}</span>
                  <button className="logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </NavLinks>
        </Container>
      </Nav>

      {/* Overlay for mobile */}
      <Overlay open={menuOpen} onClick={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
