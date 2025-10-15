import React from "react";

const PartnerList = ({ partners = [] }) => (
  <div className="partner-list">
    {partners.map((p) => (
      <div key={p.id} className="partner-card">
        <h4>{p.name}</h4>
        <p>{p.desc}</p>
      </div>
    ))}
  </div>
);

export default PartnerList;
