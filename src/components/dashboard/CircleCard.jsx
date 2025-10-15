import React from "react";

const CircleCard = ({ circle }) => {
  return (
    <div className="circle-card">
      <h4>{circle.name}</h4>
      <div>Members: {circle.members.length}</div>
      <div>Score: {circle.score}</div>
    </div>
  );
};

export default CircleCard;
