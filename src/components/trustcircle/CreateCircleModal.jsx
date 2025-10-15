import React, { useState } from "react";

const CreateCircleModal = ({ onCreate }) => {
  const [circleName, setCircleName] = useState("");

  const handleCreate = () => {
    if (circleName.trim()) {
      onCreate(circleName.trim());
      setCircleName("");
      alert("✅ Circle created successfully!");
    }
  };

  return (
    <div className="create-circle-modal">
      <input
        type="text"
        placeholder="Enter Circle Name"
        value={circleName}
        onChange={(e) => setCircleName(e.target.value)}
      />
      <button onClick={handleCreate}>Create Circle</button>
    </div>
  );
};

export default CreateCircleModal;
