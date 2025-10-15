import React from "react";

const TransactionList = ({ transactions = [] }) => (
  <div className="tx-list">
    {transactions.length === 0 && <div className="empty">No transactions yet.</div>}
    {transactions.map((t) => (
      <div key={t.id} className="tx-item">
        <div>{t.type} — {t.amount} QTM</div>
        <div className="small">{new Date(t.createdAt).toLocaleString()}</div>
      </div>
    ))}
  </div>
);

export default TransactionList;
