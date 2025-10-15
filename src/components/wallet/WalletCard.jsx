import React from "react";

const WalletCard = ({ balance }) => (
  <div className="wallet-card">
    <h3>Quantum Wallet</h3>
    <p className="wallet-value">{balance.toFixed(3)} QTM</p>
  </div>
);

export default WalletCard;
