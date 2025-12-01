import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// --- STYLED COMPONENTS ---
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
`;

const Card = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h2`
  text-align: center;
  color: #e2e8f0;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const StatusBox = styled.div`
  background: ${props =>
    props.status === "approved" ? "rgba(34, 197, 94, 0.15)" :
    props.status === "pending" ? "rgba(251, 191, 36, 0.15)" :
    "rgba(239, 68, 68, 0.15)"};
  border: 1px solid ${props =>
    props.status === "approved" ? "#22c55e" :
    props.status === "pending" ? "#f59e0b" :
    "#ef4444"};
  color: ${props =>
    props.status === "approved" ? "#22c55e" :
    props.status === "pending" ? "#f59e0b" :
    "#ef4444"};
  padding: 1rem 2rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
`;

const Label = styled.label`
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  padding: 1rem 1.2rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const Select = styled.select`
  padding: 1rem 1.2rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FileBox = styled.div`
  border: 2px dashed #334155;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #0f172a;
  position: relative;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #334155;
`;

const SubmitBtn = styled.button`
  margin-top: 1.5rem;
  padding: 1.1rem;
  background: ${props => props.disabled ? "#334155" : "linear-gradient(90deg, #3b82f6, #2563eb)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
  }
`;

const SuccessMsg = styled.div`
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid #22c55e;
  color: #22c55e;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
`;

const WarningBox = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 1.2rem;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const AgreementRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  label {
    color: #cbd5e1;
    cursor: pointer;
    font-size: 0.9rem;
  }
`;

// --- TOKEN HELPER ---
const getToken = () => {
  const rawUser = localStorage.getItem("userInfo");
  if (!rawUser) return null;
  const user = JSON.parse(rawUser);
  return user.token || null;
};

// --- MAIN COMPONENT ---
const KYC = () => {
  const [status, setStatus] = useState("not_submitted");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nid, setNid] = useState("");
  const [frontDoc, setFrontDoc] = useState(null);
  const [backDoc, setBackDoc] = useState(null);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await axios.get("/api/kyc/status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(res.data.kycStatus || "not_submitted");
      } catch {
        setStatus("not_submitted");
      }
    };
    fetchStatus();
  }, []);

  const handleFile = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitKYC = async (e) => {
    e.preventDefault();
    if (!agree) return alert("You must accept the Security Agreement before submitting.");

    const token = getToken();
    if (!token) return alert("Please login again");

    if (!fullName || !dob || !gender || !nid || !frontDoc || !backDoc) {
      return alert("All fields are required");
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("nid", nid);
    formData.append("frontDoc", frontDoc);
    formData.append("backDoc", backDoc);

    try {
      setLoading(true);
      await axios.post("/api/kyc/submit", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus("pending");
      alert("KYC submitted! Waiting for admin approval.");
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>KYC Verification</Title>
        <Subtitle>Complete your identity verification to unlock all features</Subtitle>

        <StatusBox status={status}>
          {status === "not_submitted" && "Not Submitted"}
          {status === "pending" && "Pending Review"}
          {status === "approved" && "Verified"}
        </StatusBox>

        {status === "not_submitted" && (
          <Form onSubmit={submitKYC}>
            {/* SECURITY WARNING */}
            <WarningBox>
              <strong>Security Notice:</strong><br/>
              • Your device information, IP address, and location will be recorded.<br/>
              • Duplicate or fake KYC submissions will result in permanent account suspension.<br/>
              • Using the same ID for multiple accounts will block all associated accounts.
            </WarningBox>

            <AgreementRow>
              <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
              <label>I understand and agree to the KYC Security Terms.</label>
            </AgreementRow>

            <div>
              <Label>Full Name</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter full name" required />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input type="date" value={dob} onChange={e => setDob(e.target.value)} required />
            </div>

            <div>
              <Label>Gender</Label>
              <Select value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <div>
              <Label>NID / Passport Number</Label>
              <Input value={nid} onChange={e => setNid(e.target.value)} placeholder="Enter NID" required />
            </div>

            <div>
              <Label>Front Side of Document</Label>
              <FileBox>
                <input type="file" accept="image/*" onChange={e => handleFile(e, setFrontDoc, setFrontPreview)} />
                <p>{frontDoc ? frontDoc.name : "Click to upload front side"}</p>
                {frontPreview && <PreviewImg src={frontPreview} />}
              </FileBox>
            </div>

            <div>
              <Label>Back Side of Document</Label>
              <FileBox>
                <input type="file" accept="image/*" onChange={e => handleFile(e, setBackDoc, setBackPreview)} />
                <p>{backDoc ? backDoc.name : "Click to upload back side"}</p>
                {backPreview && <PreviewImg src={backPreview} />}
              </FileBox>
            </div>

            <SubmitBtn type="submit" disabled={loading || !agree}>
              {loading ? "Submitting..." : "Submit for Verification"}
            </SubmitBtn>
          </Form>
        )}

        {status === "pending" && (
          <SuccessMsg>Your KYC is under review. You will be notified once approved.</SuccessMsg>
        )}

        {status === "approved" && (
          <SuccessMsg>KYC Verified Successfully! All features are now unlocked.</SuccessMsg>
        )}
      </Card>
    </Container>
  );
};

export default KYC;
