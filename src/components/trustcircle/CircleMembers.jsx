import React from "react";

const CircleMembers = ({ members = [] }) => {
  return (
    <div className="circle-members">
      <h5>👥 Members</h5>
      {members.length === 0 ? (
        <p>No members yet.</p>
      ) : (
        <ul>
          {members.map((m, idx) => (
            <li key={idx}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CircleMembers;
