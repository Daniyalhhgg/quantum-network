import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// ===== Animations =====
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 8px #00f5a0; }
  50% { box-shadow: 0 0 20px #00d9f5; }
`;

// ===== Styled Components =====
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #081225, #0b132b);
  padding: 2rem;
  font-family: "Inter", sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 550px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(0,0,0,0.4);
  border: 1px solid rgba(0, 245, 160, 0.2);
  color: #fff;
  animation: ${fadeInUp} 0.8s ease;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.9rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 500px) {
    font-size: 1.6rem;
  }
`;

const InfoText = styled.p`
  text-align: center;
  color: #ccc;
  margin-bottom: 1.5rem;
`;

const Status = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: ${({ status }) =>
    status === "approved" ? "#4caf50" :
    status === "pending" ? "#ffc107" : "#bbb"};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.9rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  background: rgba(255,255,255,0.15);
  color: #fff;
  outline: none;

  &:focus {
    box-shadow: 0 0 12px #00f5a0;
  }
`;

const Select = styled.select`
  padding: 0.9rem;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.15);
  color: #fff;
  font-size: 1rem;
  outline: none;

  &:focus {
    box-shadow: 0 0 12px #00f5a0;
  }
`;

const FileLabel = styled.label`
  padding: 0.8rem;
  background: rgba(0,245,160,0.2);
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  display: block;
  text-align: center;
`;

const Preview = styled.img`
  width: 160px;
  border-radius: 12px;
  margin-top: 0.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  border: 1px solid rgba(0,245,160,0.2);
`;

const SubmitBtn = styled.button`
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  color: #0b132b;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: ${glowPulse} 3s infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px #00f5a0;
  }
`;

const Pending = styled.div`
  text-align: center;
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 12px;
  font-weight: bold;
  color: #ffc107;
`;

const Approved = styled.div`
  text-align: center;
  background: rgba(76,175,80,0.15);
  padding: 1rem;
  border-radius: 12px;
  color: #4caf50;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(76,175,80,0.4);
`;

const ResetBtn = styled.button`
  margin-top: 1rem;
  background: linear-gradient(90deg, #f44336, #ff7961);
  color: #fff;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
`;

// ===== Component =====
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
    if (!file) return;
    if (type === "front") {
      setFrontDoc(file);
      setFrontPreview(URL.createObjectURL(file));
    } else {
      setBackDoc(file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const submitKYC = (e) => {
    e.preventDefault();
    if (!fullName || !dob || !gender || !nid || !frontDoc || !backDoc) {
      alert("⚠️ Complete all fields and upload both ID sides.");
      return;
    }
    setStatus("pending");
    localStorage.setItem("kycStatus", "pending");

    setTimeout(() => {
      setStatus("approved");
      localStorage.setItem("kycStatus", "approved");

      const pending = parseFloat(localStorage.getItem("pendingBalance") || "0");
      const balance = parseFloat(localStorage.getItem("balance") || "0");
      if (pending > 0) {
        const total = balance + pending;
        localStorage.setItem("balance", total.toString());
        localStorage.setItem("pendingBalance", "0");
        alert(`✅ KYC approved! ${pending} pending tokens added.`);
      } else {
        alert("✅ KYC approved! Withdrawals enabled.");
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
    <Container>
      <Card>
        <Title>KYC Verification</Title>
        <InfoText>Verify your identity to enable withdrawals and trading.</InfoText>

        <Status status={status}>
          {status === "approved" ? "Verified ✅" :
           status === "pending" ? "Pending ⏳" :
           "Not Submitted"}
        </Status>

        {status === "not_submitted" && (
          <Form onSubmit={submitKYC}>
            <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
            <Input type="date" value={dob} onChange={e => setDob(e.target.value)} />
            <Select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            <Input placeholder="National ID Number" value={nid} onChange={e => setNid(e.target.value)} />

            <FileLabel>
              Upload Front of ID
              <input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, "front")} style={{ display: "none" }} />
            </FileLabel>
            {frontPreview && <Preview src={frontPreview} alt="Front ID" />}

            <FileLabel>
              Upload Back of ID
              <input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, "back")} style={{ display: "none" }} />
            </FileLabel>
            {backPreview && <Preview src={backPreview} alt="Back ID" />}

            <SubmitBtn type="submit">Submit KYC</SubmitBtn>
          </Form>
        )}

        {status === "pending" && <Pending>⏳ Your KYC is under review...</Pending>}

        {status === "approved" && (
          <Approved>
            ✅ You are KYC verified!<br />
            Withdrawals and transfers are now enabled.
            <br />
            <ResetBtn onClick={resetKYC}>Reset KYC</ResetBtn>
          </Approved>
        )}
      </Card>
    </Container>
  );
};

export default KYC;
