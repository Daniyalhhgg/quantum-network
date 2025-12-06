// =====================
// KYC.jsx — Final Premium Version + Security Notice
// =====================

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";

// -------------------- UI COMPONENTS --------------------
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
`;

const Card = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
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
`;

const Input = styled.input`
  padding: 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 1rem;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
`;

const FileBox = styled.div`
  border: 2px dashed #334155;
  border-radius: 12px;
  padding: 1.3rem;
  text-align: center;
  background: #0f172a;
  cursor: pointer;
  position: relative;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  margin-top: 1rem;
`;

const SecurityNotice = styled.div`
  background: rgba(59,130,246,0.1);
  border: 1px solid #3b82f6;
  color: #93c5fd;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin-top: 0.8rem;

  input {
    transform: scale(1.3);
    margin-top: 3px;
  }
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
`;

const SuccessMsg = styled.div`
  background: rgba(34,197,94,0.15);
  border: 1px solid #22c55e;
  color: #22c55e;
  padding: 1.6rem;
  border-radius: 16px;
  text-align: center;
  font-size: 1.2rem;
`;

// -------------------- API CONFIG --------------------
const API_BASE =
  (process.env.REACT_APP_API_URL || "http://localhost:5000/api")
    .replace(/\/$/, "");

const getToken = () => {
  const raw = localStorage.getItem("userInfo");
  if (!raw) return null;
  try {
    return JSON.parse(raw).token;
  } catch {
    return null;
  }
};

// -------------------- MAIN COMPONENT --------------------
const KYC = () => {
  const { login } = useContext(AuthContext);

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

  // -------------------- Fetch KYC Status --------------------
  const fetchKyc = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/kyc/status`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() }
      });
      setStatus(res.data.kycStatus || "not_submitted");

      if (res.data.kycStatus === "approved") {
        const me = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        login(me.data.user);
        localStorage.setItem("userInfo", JSON.stringify(me.data.user));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, []);

  useEffect(() => {
    if (status === "pending") {
      const interval = setInterval(fetchKyc, 7000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // -------------------- File Preview --------------------
  const handleFile = (e, setter, previewSetter) => {
    const f = e.target.files[0];
    if (f) {
      setter(f);
      previewSetter(URL.createObjectURL(f));
    }
  };

  // -------------------- Submit KYC --------------------
  const submitKYC = async (e) => {
    e.preventDefault();

    if (!agree) return alert("You must accept the security terms to continue.");

    const token = getToken();
    if (!token) return alert("Login again!");

    if (!fullName || !dob || !gender || !nid || !frontDoc || !backDoc)
      return alert("All fields required");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("nid", nid);
    formData.append("frontDoc", frontDoc);
    formData.append("backDoc", backDoc);

    try {
      setLoading(true);

      await axios.post(`${API_BASE}/kyc/submit`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus("pending");
      alert("KYC submitted!");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <Container>
      <Card>
        <Title>KYC Verification</Title>
        <Subtitle>Complete verification to unlock all features</Subtitle>

        <StatusBox status={status}>
          {status === "not_submitted" && "Not Submitted"}
          {status === "pending" && "Pending Review"}
          {status === "approved" && "Verified"}
          {status === "rejected" && "Rejected"}
        </StatusBox>

        {status === "not_submitted" && (
          <Form onSubmit={submitKYC}>
            <div>
              <Label>Full Name</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </div>

            <div>
              <Label>NID / Passport Number</Label>
              <Input value={nid} onChange={e => setNid(e.target.value)} required />
            </div>

            <div>
              <Label>Front Side Document</Label>
              <FileBox>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFile(e, setFrontDoc, setFrontPreview)}
                />
                <p>{frontDoc ? frontDoc.name : "Upload front side"}</p>
                {frontPreview && <PreviewImg src={frontPreview} />}
              </FileBox>
            </div>

            <div>
              <Label>Back Side Document</Label>
              <FileBox>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFile(e, setBackDoc, setBackPreview)}
                />
                <p>{backDoc ? backDoc.name : "Upload back side"}</p>
                {backPreview && <PreviewImg src={backPreview} />}
              </FileBox>
            </div>

            {/* -------------------- SECURITY NOTICE -------------------- */}
            <SecurityNotice>
              <strong>Security Notice:</strong><br />
              • Your device information, IP address, and location will be recorded.<br />
              • Duplicate or fake KYC submissions will result in permanent account suspension.<br />
              • Using the same ID for multiple accounts will block all associated accounts.
            </SecurityNotice>

            <CheckboxContainer>
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <span style={{ color: "#cbd5e1" }}>
                I understand and agree to the KYC Security Terms.
              </span>
            </CheckboxContainer>

            <SubmitBtn disabled={loading || !agree}>
              {loading ? "Submitting..." : "Submit for Verification"}
            </SubmitBtn>
          </Form>
        )}

        {status === "pending" && (
          <SuccessMsg>Your KYC is under review...</SuccessMsg>
        )}

        {status === "approved" && (
          <SuccessMsg>KYC Verified Successfully 🎉</SuccessMsg>
        )}
      </Card>
    </Container>
  );
};

export default KYC;