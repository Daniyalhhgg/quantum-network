import React, { createContext, useState } from "react";

export const MiningContext = createContext();

export const MiningProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [isMining, setIsMining] = useState(false);

  const startMining = () => {
    setIsMining(true);
    let earned = 0;
    const mining = setInterval(() => {
      earned += 0.001;
      setBalance((prev) => prev + 0.001);
      if (earned >= 0.01) {
        clearInterval(mining);
        setIsMining(false);
      }
    }, 1000);
  };

  return (
    <MiningContext.Provider value={{ balance, isMining, startMining }}>
      {children}
    </MiningContext.Provider>
  );
};
