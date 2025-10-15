import React, { useState } from "react";

const AttestationForm = ({ onAttest }) => {
  const [note, setNote] = useState("");

  const handleAttest = () => {
    if (note.trim()) {
      onAttest({ note, date: new Date().toLocaleString() });
      setNote("");
      alert("✅ Attestation submitted!");
    }
  };

  return (
    <div className="attestation-form">
      <textarea
        placeholder="Write attestation..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={handleAttest}>Submit Attestation</button>
    </div>
  );
};

export default AttestationForm;
