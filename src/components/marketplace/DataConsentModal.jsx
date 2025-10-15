import React from "react";

const DataConsentModal = ({ onOptIn }) => {
  return (
    <div className="consent">
      <p>Opt-in to anonymously sell engagement data for tokens. You keep 70%.</p>
      <button onClick={() => onOptIn(true)}>Opt In</button>
      <button onClick={() => onOptIn(false)}>Cancel</button>
    </div>
  );
};

export default DataConsentModal;
