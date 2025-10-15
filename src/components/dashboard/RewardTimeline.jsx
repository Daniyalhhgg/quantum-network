import React from "react";

const RewardTimeline = ({ events = [] }) => {
  return (
    <div className="timeline">
      {events.length === 0 && <div className="empty">No reward events yet</div>}
      {events.map((e, i) => (
        <div key={i} className="timeline-item">
          <div><strong>{e.type}</strong></div>
          <div className="small">{new Date(e.timestamp).toLocaleString()}</div>
          <div className="small">+{e.amount} QTM</div>
        </div>
      ))}
    </div>
  );
};

export default RewardTimeline;
