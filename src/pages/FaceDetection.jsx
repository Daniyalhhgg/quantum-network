// =====================
// SecuritySelfie.jsx — Live Selfie Verification Every 15 Days
// Professional Version with "Feature in Process" Notice
// =====================

import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

// -------------------- UI Components --------------------
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: 'Inter', sans-serif;
  padding: 2rem;
`;

const Card = styled.div`
  background: #1e293b;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid #334155;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  text-align: center;
`;

const Title = styled.h2`
  color: #e2e8f0;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const CameraWrapper = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const Video = styled.video`
  width: 100%;
  max-width: 320px;
  border-radius: 12px;
  margin-top: 0.5rem;
  border: 2px solid #3b82f6;
`;

const PreviewImg = styled.img`
  width: 100%;
  max-width: 320px;
  border-radius: 12px;
  margin-top: 1rem;
  border: 2px solid #22c55e;
`;

const Btn = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #fff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-right: 0.5rem;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
  &:disabled { background: #334155; cursor: not-allowed; }
`;

const InfoText = styled.div`
  color: #cbd5e1;
  margin-top: 1rem;
  font-size: 0.95rem;
`;

const FeatureNotice = styled.div`
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid #3b82f6;
  color: #3b82f6;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: center;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Attention = styled.span`
  display: inline-block;
  color: #facc15;
  font-weight: 700;
  animation: ${pulse} 1.5s infinite;
`;

// -------------------- MAIN COMPONENT --------------------
const SecuritySelfie = () => {
  const videoRef = useRef(null);

  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  const [lastUpload, setLastUpload] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);

  const SELFIE_KEY = "lastSecuritySelfie"; // localStorage key
  const LAST_DATE_KEY = "lastSelfieDate";

  // -------------------- Check last upload --------------------
  useEffect(() => {
    const lastDate = localStorage.getItem(LAST_DATE_KEY);
    if (lastDate) {
      const diff = Math.floor((Date.now() - new Date(lastDate)) / (1000 * 60 * 60 * 24));
      setDaysLeft(diff >= 15 ? 0 : 15 - diff);
      setLastUpload(lastDate);
    }
    const savedSelfie = localStorage.getItem(SELFIE_KEY);
    if (savedSelfie) setSelfiePreview(savedSelfie);
  }, []);

  // -------------------- Camera Functions --------------------
  const startCamera = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return alert("Camera not supported");
    }
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      })
      .catch(err => alert("Camera access denied: " + err.message));
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) return alert("Failed to capture selfie");
      const url = URL.createObjectURL(blob);
      setSelfie(new File([blob], "securitySelfie.jpg", { type: "image/jpeg" }));
      setSelfiePreview(url);
    }, "image/jpeg");
  };

  // -------------------- Submit --------------------
  const submitSelfie = () => {
    if (!selfie && !selfiePreview) return alert("Capture your selfie first");
    // Save locally (demo); in production send to server or Cloudinary
    localStorage.setItem(SELFIE_KEY, selfiePreview);
    localStorage.setItem(LAST_DATE_KEY, new Date().toISOString());
    setLastUpload(new Date().toISOString());
    setDaysLeft(15);
    alert("Selfie uploaded successfully!");

    // Stop camera
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  return (
    <Container>
      <Card>
        <FeatureNotice>
          <Attention>⚠️ FEATURE IN PROCESS ⚠️</Attention><br />
          This security selfie feature is <strong>under active development</strong>. 
          It may receive updates for cloud storage and advanced verification soon.
        </FeatureNotice>

        <Title>Security Selfie Verification</Title>
        <Subtitle>Upload a new selfie every 15 days for security purposes</Subtitle>

        {daysLeft > 0 ? (
          <InfoText>
            You have uploaded a selfie recently.<br />
            Next upload available in <strong>{daysLeft} day(s)</strong>.
          </InfoText>
        ) : (
          <>
            <CameraWrapper>
              {!selfiePreview && <Video ref={videoRef} autoPlay muted />}
              <div>
                <Btn onClick={startCamera}>Start Camera</Btn>
                <Btn onClick={captureSelfie}>
                  {selfiePreview ? "Retake Selfie" : "Capture Selfie"}
                </Btn>
              </div>
              {selfiePreview && <PreviewImg src={selfiePreview} />}
            </CameraWrapper>

            <Btn onClick={submitSelfie}>Submit Selfie</Btn>
          </>
        )}

        {lastUpload && (
          <InfoText>
            Stay Tuned {new Date(lastUpload).toLocaleDateString()}
          </InfoText>
        )}
      </Card>
    </Container>
  );
};

export default SecuritySelfie;

