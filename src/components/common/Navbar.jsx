import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const getUsername = () => {
    if (typeof user?.username === "string") return user.username;
    if (typeof user?.user?.username === "string") return user.user.username;
    return "User";
  };

  return (
    <>
      <style>{`
        /* Navbar Styles */
        .quantum-navbar {
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 15, 30, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 245, 160, 0.15);
          box-shadow: 0 2px 10px rgba(0, 245, 160, 0.05);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.7rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
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
        }

        .navbar-logo:hover {
          opacity: 0.8;
        }

        .menu-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          border: none;
          background: none;
          cursor: pointer;
        }

        .menu-btn span {
          width: 24px;
          height: 2px;
          background: #bfffe6;
          border-radius: 3px;
          transition: 0.3s;
        }

        .menu-btn.active span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .menu-btn.active span:nth-child(2) {
          opacity: 0;
        }
        .menu-btn.active span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          transition: 0.3s;
        }

        .nav-links a {
          color: #bfffe6;
          font-weight: 500;
          text-decoration: none;
          transition: 0.25s;
          position: relative;
        }

        .nav-links a::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          left: 0;
          bottom: -2px;
          background: #00f5a0;
          transition: width 0.3s;
        }

        .nav-links a:hover::after,
        .nav-links a.active::after {
          width: 100%;
        }

        .nav-user-controls {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-left: 1rem;
        }

        .nav-username {
          font-weight: 600;
          color: #00d9f5;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid #00f5a0;
          color: #00f5a0;
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.25s;
        }

        .logout-btn:hover {
          background: #00f5a0;
          color: #05101a;
          box-shadow: 0 0 10px rgba(0, 245, 160, 0.5);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .menu-btn {
            display: flex;
          }

          .nav-links {
            position: absolute;
            top: 60px;
            right: 0;
            background: rgba(5, 10, 25, 0.95);
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem 1.2rem;
            border-radius: 10px 0 0 10px;
            transform: translateX(110%);
          }

          .nav-links.open {
            transform: translateX(0);
          }

          .nav-links a {
            display: block;
            padding: 0.4rem 0;
          }

          .nav-user-controls {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>

      <header className="quantum-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            ⚛ <span>Quantum</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`menu-btn ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Navigation Links */}
          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
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
              </>
            )}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}

            {user && (
              <div className="nav-user-controls">
                <span className="nav-username">Hi, {getUsername()}</span>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
