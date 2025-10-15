import React from "react";

const Admin = () => {
  return (
    <section className="admin-page">
      <h2>Admin / Governance (mock)</h2>
      <p>Manage proposals, review KYC, view system metrics.</p>
      <div className="admin-grid">
        <div className="card">Total users: {JSON.parse(localStorage.getItem("users")||"[]").length}</div>
        <div className="card">Pending KYC: {localStorage.getItem("kyc_status")==="pending" ? 1 : 0}</div>
      </div>
    </section>
  );
};

export default Admin;
