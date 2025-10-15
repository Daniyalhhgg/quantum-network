import React, { useState } from "react";

const TransferModal = ({ onSend }) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSend({ to, amount: parseFloat(amount) });
    setTo("");
    setAmount("");
  };

  return (
    <form className="transfer-form" onSubmit={submit}>
      <input placeholder="Recipient (username or address)" value={to} onChange={(e) => setTo(e.target.value)} required />
      <input placeholder="Amount QTM" type="number" step="0.001" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <button type="submit">Send</button>
    </form>
  );
};

export default TransferModal;
