import React, { createContext, useState } from "react";

export const CircleContext = createContext();

export const CircleProvider = ({ children }) => {
  const [circles, setCircles] = useState([]);

  const createCircle = (name) => {
    const newCircle = {
      id: Date.now(),
      name,
      members: [],
      attestations: [],
    };
    setCircles((prev) => [...prev, newCircle]);
  };

  const addMemberToCircle = (circleId, member) => {
    setCircles((prev) =>
      prev.map((circle) =>
        circle.id === circleId
          ? { ...circle, members: [...circle.members, member] }
          : circle
      )
    );
  };

  const attestToCircle = (circleId, attestation) => {
    setCircles((prev) =>
      prev.map((circle) =>
        circle.id === circleId
          ? { ...circle, attestations: [...circle.attestations, attestation] }
          : circle
      )
    );
  };

  return (
    <CircleContext.Provider
      value={{ circles, createCircle, addMemberToCircle, attestToCircle }}
    >
      {children}
    </CircleContext.Provider>
  );
};
