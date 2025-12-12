// =====================
// KYC.jsx — FULLY UPDATED + CAMERA SUPPORT (Laptop + Mobile)
// =====================

import React, { useState, useEffect, useContext, useRef } from "react";
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
    props.status === "rejected" ? "rgba(239, 68, 68, 0.15)" :
    "rgba(100, 116, 139, 0.15)"};
  border: 1px solid ${props =>
    props.status === "approved" ? "#22c55e" :
    props.status === "pending" ? "#f59e0b" :
    props.status === "rejected" ? "#ef4444" :
    "#64748b"};
  color: ${props =>
    props.status === "approved" ? "#22c55e" :
    props.status === "pending" ? "#f59e0b" :
    props.status === "rejected" ? "#ef4444" :
    "#cbd5e1"};
  padding: 1rem 2rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const RejectionBox = styled.div`
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid #ef4444;
  color: #fca5a5;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  margin: 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.7;
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
  &:focus { border-color: #3b82f6; outline: none; }
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
  input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
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
  input { transform: scale(1.3); margin-top: 3px; }
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

const CameraWrapper = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const Video = styled.video`
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  margin-top: 0.5rem;
`;

const CaptureBtn = styled.button`
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

// -------------------- API CONFIG --------------------
const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const getToken = () => {
  const raw = localStorage.getItem("userInfo");
  if (!raw) return null;
  try { return JSON.parse(raw).token; } catch { return null; }
};

// -------------------- MAIN COMPONENT --------------------
const KYC = () => {
  const { login } = useContext(AuthContext);

  const [status, setStatus] = useState("not_submitted");
  const [rejectionReason, setRejectionReason] = useState("");

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nid, setNid] = useState("");

  // File states
  const [frontDoc, setFrontDoc] = useState(null);
  const [backDoc, setBackDoc] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [selfiePreview, setSelfiePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  // Camera ref
  const videoRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);

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
      setRejectionReason(res.data.kycRejectionReason || "");

      if (res.data.kycStatus === "approved") {
        const me = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        login(me.data.user);
        localStorage.setItem("userInfo", JSON.stringify(me.data.user));
      }
    } catch (err) { console.log("KYC status fetch error:", err); }
  };

  useEffect(() => { fetchKyc(); }, []);
  useEffect(() => {
    if (status === "pending") {
      const interval = setInterval(fetchKyc, 8000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // -------------------- Camera Functions --------------------
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return alert("Camera not supported");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraStarted(true);
    } catch (err) {
      alert("Camera access denied: " + err.message);
    }
  };

  const captureSelfie = () => {
    if (!videoRef.current) return alert("Start camera first!");
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) return alert("Failed to capture selfie, try again.");
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      setSelfie(file);
      setSelfiePreview(URL.createObjectURL(file));
    }, "image/jpeg");
  };

  // -------------------- File Upload Preview --------------------
  const handleFile = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (file) { setter(file); previewSetter(URL.createObjectURL(file)); }
  };

  // -------------------- Submit KYC --------------------
  const submitKYC = async (e) => {
    e.preventDefault();
    if (!agree) return alert("You must accept the terms!");
    const token = getToken();
    if (!token) return alert("Please login again");
    if (!fullName || !dob || !gender || !nid || !frontDoc || !backDoc || !selfie) {
      return alert("All fields are required including selfie!");
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("nid", nid);
    formData.append("frontDoc", frontDoc);
    formData.append("backDoc", backDoc);
    formData.append("selfie", selfie);

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/kyc/submit`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus("pending");
      alert("KYC submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally { setLoading(false); }
  };

  // -------------------- RENDER --------------------
  return (
    <Container>
      <Card>
        <Title>KYC Verification</Title>
        <Subtitle>Verify your identity to unlock withdrawals & full access</Subtitle>

        <StatusBox status={status}>
          {status === "not_submitted" && "Not Submitted"}
          {status === "pending" && "Pending Review"}
          {status === "approved" && "Verified Successfully"}
          {status === "rejected" && "Rejected"}
        </StatusBox>

        {status === "rejected" && (
          <RejectionBox>
            <div style={{ color: "#ef4444", fontSize: "1.4rem", marginBottom: "0.8rem" }}>KYC Rejected</div>
            <div style={{ color: "#fecaca", lineHeight: "1.6" }}>
              <strong>Reason from Admin:</strong><br />{rejectionReason || "No reason provided"}
            </div>
            <div style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#fda4af" }}>
              Please fix the issue and resubmit your KYC.
            </div>
          </RejectionBox>
        )}

        {status === "pending" && <SuccessMsg>Your KYC is under review...<br /><small>Please wait 24-48 hours</small></SuccessMsg>}
        {status === "approved" && <SuccessMsg>KYC Verified Successfully</SuccessMsg>}

        {status === "not_submitted" && (
          <Form onSubmit={submitKYC}>
            <Label>Full Name (as per ID)</Label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} required />

            <Label>Date of Birth</Label>
            <Input type="date" value={dob} onChange={e => setDob(e.target.value)} required />

            <Label>Gender</Label>
            <Select value={gender} onChange={e => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>

            <Label>NID / Passport Number</Label>
            <Input value={nid} onChange={e => setNid(e.target.value)} required />

            <Label>Front Side of ID</Label>
            <FileBox>
              <input type="file" accept="image/*" onChange={e => handleFile(e, setFrontDoc, setFrontPreview)} />
              <p>{frontDoc ? frontDoc.name : "Click to upload front side"}</p>
              {frontPreview && <PreviewImg src={frontPreview} />}
            </FileBox>

            <Label>Back Side of ID</Label>
            <FileBox>
              <input type="file" accept="image/*" onChange={e => handleFile(e, setBackDoc, setBackPreview)} />
              <p>{backDoc ? backDoc.name : "Click to upload back side"}</p>
              {backPreview && <PreviewImg src={backPreview} />}
            </FileBox>

            <Label>Live Selfie</Label>
            <CameraWrapper>
              <Video ref={videoRef} autoPlay muted />
              <div>
                <CaptureBtn type="button" onClick={startCamera}>
                  {cameraStarted ? "Restart Camera" : "Start Camera"}
                </CaptureBtn>
                <CaptureBtn type="button" onClick={captureSelfie}>
                  {selfiePreview ? "Retake Selfie" : "Capture Selfie"}
                </CaptureBtn>
              </div>
              {selfiePreview && <PreviewImg src={selfiePreview} />}
            </CameraWrapper>

            <SecurityNotice>
              <strong>Security Notice:</strong><br />
              • Your device, IP, and location are recorded.<br />
              • Fake or duplicate KYC = Permanent Ban.<br />
              • Same ID on multiple accounts = All accounts blocked.
            </SecurityNotice>

            <CheckboxContainer>
              <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
              <span style={{ color: "#cbd5e1" }}>I accept the KYC Security Terms</span>
            </CheckboxContainer>

            <SubmitBtn disabled={loading || !agree}>{loading ? "Submitting..." : "Submit KYC"}</SubmitBtn>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default KYC;

