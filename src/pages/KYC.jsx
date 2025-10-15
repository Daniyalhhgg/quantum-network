import React, { useState, useEffect } from "react";

const KYC = () => {
  const [status, setStatus] = useState(localStorage.getItem("kycStatus") || "not_submitted");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nid, setNid] = useState("");
  const [frontDoc, setFrontDoc] = useState(null);
  const [backDoc, setBackDoc] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  useEffect(() => {
    const storedStatus = localStorage.getItem("kycStatus");
    if (storedStatus) setStatus(storedStatus);
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "front") {
      setFrontDoc(file);
      if (file) setFrontPreview(URL.createObjectURL(file));
    } else {
      setBackDoc(file);
      if (file) setBackPreview(URL.createObjectURL(file));
    }
  };

  const submitKYC = (e) => {
    e.preventDefault();

    if (!fullName || !dob || !gender || !nid || !frontDoc || !backDoc) {
      alert("⚠️ Please complete all fields and upload both sides of your ID.");
      return;
    }

    setStatus("pending");
    localStorage.setItem("kycStatus", "pending");

    // Simulate KYC approval
    setTimeout(() => {
      setStatus("approved");
      localStorage.setItem("kycStatus", "approved");

      // Move pending tokens to wallet
      const pending = parseFloat(localStorage.getItem("pendingBalance") || "0");
      const balance = parseFloat(localStorage.getItem("balance") || "0");
      if (pending > 0) {
        const total = balance + pending;
        localStorage.setItem("balance", total.toString());
        localStorage.setItem("pendingBalance", "0");
        alert(`✅ KYC approved! ${pending} pending tokens added to your wallet.`);
      } else {
        alert("✅ KYC approved! You can now withdraw and trade tokens.");
      }
    }, 2000);
  };

  const resetKYC = () => {
    setStatus("not_submitted");
    setFullName("");
    setDob("");
    setGender("");
    setNid("");
    setFrontDoc(null);
    setBackDoc(null);
    setFrontPreview(null);
    setBackPreview(null);
    localStorage.setItem("kycStatus", "not_submitted");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 0 30px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          transition: "0.3s",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.8rem",
            marginBottom: "1rem",
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          KYC Verification
        </h2>
        <p style={{ textAlign: "center", color: "#ccc", marginBottom: "1.5rem" }}>
          Verify your identity to enable secure withdrawals and trading.
        </p>

        {/* Status Display */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontWeight: "bold",
            fontSize: "1.1rem",
            color:
              status === "approved" ? "#4caf50" : status === "pending" ? "#ffc107" : "#bbb",
          }}
        >
          Status:{" "}
          {status === "approved" ? (
            <span>Verified ✅</span>
          ) : status === "pending" ? (
            <span>Pending ⏳</span>
          ) : (
            status.replace("_", " ")
          )}
        </div>

        {/* KYC Form */}
        {status === "not_submitted" && (
          <form
            onSubmit={submitKYC}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={inputStyle}
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="National ID Number"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              style={inputStyle}
            />

            <label style={fileLabelStyle}>
              Upload Front of ID
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, "front")}
                style={{ display: "none" }}
              />
            </label>
            {frontPreview && <img src={frontPreview} alt="Front ID Preview" style={previewStyle} />}

            <label style={fileLabelStyle}>
              Upload Back of ID
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, "back")}
                style={{ display: "none" }}
              />
            </label>
            {backPreview && <img src={backPreview} alt="Back ID Preview" style={previewStyle} />}

            <button type="submit" style={submitBtnStyle}>
              Submit KYC
            </button>
          </form>
        )}

        {/* Pending */}
        {status === "pending" && (
          <div style={pendingStyle}>⏳ Your KYC is under review...</div>
        )}

        {/* Approved */}
        {status === "approved" && (
          <div style={approvedStyle}>
            ✅ You are KYC verified!
            <br />
            Withdrawals and transfers are now enabled.
            <br />
            <button onClick={resetKYC} style={resetBtnStyle}>
              Reset KYC
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// === Styles ===
const inputStyle = {
  padding: "0.9rem",
  borderRadius: "10px",
  border: "none",
  fontSize: "1rem",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  outline: "none",
};

const fileLabelStyle = {
  padding: "0.8rem",
  background: "rgba(0,200,255,0.25)",
  borderRadius: "10px",
  textAlign: "center",
  cursor: "pointer",
  fontWeight: "600",
};

const previewStyle = {
  width: "160px",
  borderRadius: "12px",
  marginTop: "0.5rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  border: "1px solid rgba(255,255,255,0.2)",
};

const submitBtnStyle = {
  background: "linear-gradient(90deg, #00c853, #b2ff59)",
  color: "#000",
  fontWeight: "bold",
  padding: "0.9rem",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "1rem",
};

const pendingStyle = {
  textAlign: "center",
  marginTop: "1.5rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: "1rem",
  borderRadius: "12px",
  color: "#ffc107",
  fontWeight: "bold",
  animation: "pulse 1.5s infinite",
};

const approvedStyle = {
  textAlign: "center",
  marginTop: "1.5rem",
  backgroundColor: "rgba(76, 175, 80, 0.15)",
  padding: "1rem",
  borderRadius: "12px",
  color: "#4caf50",
  fontWeight: "bold",
  boxShadow: "0 0 10px rgba(76,175,80,0.4)",
};

const resetBtnStyle = {
  marginTop: "1rem",
  background: "linear-gradient(90deg, #f44336, #ff7961)",
  color: "#fff",
  border: "none",
  padding: "0.7rem 1.2rem",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default KYC;
