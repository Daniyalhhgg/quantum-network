import React from "react";
import "../../styles/main.css";

const MiningButton = ({ onClick, isMining }) => {
  return (
    <button className="mining-btn" onClick={onClick} disabled={isMining}>
      {isMining ? "⛏️ Mining..." : "Start Mining"}
    </button>
  );
};

export default MiningButton;
