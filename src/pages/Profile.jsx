// src/pages/Profile.jsx — Updated 2025 Refresh-Safe + 30% Smaller UI
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaCamera, FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

/* ---------------------------- STYLES ---------------------------- */

const AVATAR_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #0a0f1c 0%, #0d152b 100%);
  padding: 0.7rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: "Inter", sans-serif;
  color: #e6edf7;
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 490px;
  background: rgba(255,255,255,0.06);
  border-radius: 22px;
  padding: 1.4rem;
  border: 1px solid rgba(0, 255, 200, 0.18);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 56px rgba(0,0,0,0.45);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  @media (max-width: 768px) { padding: 1.2rem; }
  @media (max-width: 480px) { padding: 0.85rem; border-radius: 16px; }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00f4b0, #00d5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.3rem;
  @media (max-width: 480px) { font-size: 1.2rem; }
`;

const EmailBox = styled.div`
  text-align: center;
  background: rgba(255,255,255,0.08);
  padding: 0.55rem 0.7rem;
  border-radius: 9px;
  margin: 0.5rem auto 1rem;
  font-size: 0.63rem;
  color: #b7d9f5;
  border: 1px solid rgba(255,255,255,0.1);

  @media (max-width: 480px) {
    font-size: 0.55rem;
    padding: 0.45rem 0.6rem;
    margin: 0.4rem auto 0.8rem;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 98px;
  height: 98px;
  margin: -30px auto 0.8rem;

  @media (max-width: 480px) {
    width: 77px;
    height: 77px;
    margin: -20px auto 0.6rem;
  }
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${(p) =>
    p.src
      ? `url(${p.src}) center/cover no-repeat`
      : "linear-gradient(135deg, #00f4b0, #00d5ff)"};
  border: 2.8px solid #00f4c0;
  box-shadow: 0 0 38px rgba(0,255,200,0.6);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 45px rgba(0,255,200,0.75);
  }
`;

const CameraBtn = styled.label`
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 28px;
  height: 28px;
  background: linear-gradient(145deg, #00f4c0, #00e0ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.84rem;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0,255,200,0.65);
  transition: transform 0.25s ease;
  &:hover { transform: scale(1.07); }

  @media (max-width: 480px) { width: 22px; height: 22px; font-size: 0.7rem; }
`;

const Label = styled.label`
  color: #00e7c2;
  font-weight: 600;
  font-size: 0.7rem;
  margin: 0.5rem 0 0.2rem;
  @media (max-width: 480px) { font-size: 0.65rem; }
`;

const Input = styled.input`
  width: 95%;
  padding: 0.7rem 0.85rem;
  border-radius: 11px;
  border: 1px solid rgba(0,255,200,0.25);
  background: rgba(255,255,255,0.07);
  color: #fff;
  font-size: 0.7rem;
  transition: all 0.25s ease;

  &:focus { outline: none; border-color: #00f4c0; box-shadow: 0 0 8px rgba(0,255,200,0.4); }
  @media (max-width: 480px) { width: 95%; padding: 0.55rem 0.7rem; font-size: 0.65rem; }
`;

const TextArea = styled.textarea`
  width: 95%;
  padding: 0.7rem 0.85rem;
  border-radius: 11px;
  border: 1px solid rgba(0,255,200,0.25);
  background: rgba(255,255,255,0.07);
  color: #fff;
  font-size: 0.7rem;
  min-height: 84px;
  transition: all 0.25s ease;

  &:focus { outline: none; border-color: #00f4c0; box-shadow: 0 0 8px rgba(0,255,200,0.4); }
  @media (max-width: 480px) { padding: 0.55rem 0.7rem; font-size: 0.65rem; min-height: 70px; }
`;

const SaveBtn = styled(motion.button)`
  width: 100%;
  padding: 0.85rem;
  margin-top: 1.2rem;
  border-radius: 13px;
  font-size: 0.77rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  background: linear-gradient(90deg, #00f4b0, #00d5ff);
  transition: all 0.25s ease;
  &:hover { box-shadow: 0 5px 16px rgba(0,255,200,0.5); transform: translateY(-1px); }
  @media (max-width: 480px) { font-size: 0.7rem; padding: 0.7rem; }
`;

const Toast = styled(motion.div)`
  position: fixed;
  top: 16px;
  right: 12px;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  z-index: 9999;

  background: ${(p) => p.success ? "linear-gradient(45deg,#00f4b0,#00d5ff)" : "linear-gradient(45deg,#ff4b4b,#ff9b30)"};

  @media (max-width: 480px) { top: 10px; right: 8px; font-size: 0.6rem; padding: 0.55rem 0.8rem; }
`;

/* ---------------------------- API CLIENT ---------------------------- */

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api" });

/* ---------------------------- COMPONENT ---------------------------- */

export default function ProfilePage() {
  const fileRef = useRef(null);
  const [data, setData] = useState({ fullName:"", phone:"", idNumber:"", dob:"", bio:"", avatar:"", email:"" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;

  useEffect(() => {
    if (!token) return;
    api.defaults.headers.Authorization = `Bearer ${token}`;
    (async () => {
      try {
        const res = await api.get("/profile/my");
        const p = res.data.profile;
        setData({
          fullName: p.fullName || "",
          phone: p.phone || "",
          idNumber: p.idNumber || "",
          dob: p.dob ? p.dob.split("T")[0] : "",
          bio: p.bio || "",
          avatar: p.avatar || "",
          email: p.email || "",
        });
      } catch (e) { showToast("Failed to load profile", false); }
      setLoading(false);
    })();
  }, []);

  const showToast = (msg, success = true) => { setToast({ msg, success }); setTimeout(() => setToast(null), 3500); }

  const saveProfile = async () => {
    if (!data.fullName || !data.phone || !data.idNumber.trim()) return showToast("Full Name, Phone & ID Number are required!", false);
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phone", data.phone);
      formData.append("idNumber", data.idNumber);
      formData.append("dob", data.dob);
      formData.append("bio", data.bio);
      if (fileRef.current?.files?.[0]) formData.append("avatar", fileRef.current.files[0]);
      await api.post("/profile/update", formData);
      showToast("Profile updated successfully!");
    } catch (e) { showToast(e.response?.data?.message || "Update failed", false); }
    setSaving(false);
  };

  if (loading) return (
    <Page>
      <Card>
        <div style={{ textAlign: "center", padding: "2.8rem" }}><h3>Loading profile...</h3></div>
      </Card>
    </Page>
  );

  return (
    <Page>
      <AnimatePresence>
        {toast && (
          <Toast success={toast.success} initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}>
            {toast.success ? <FaCheckCircle /> : <MdError />}
            {toast.msg}
          </Toast>
        )}
      </AnimatePresence>

      <Card initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Title>My Profile</Title>
        <EmailBox>Logged in as: {data.email}</EmailBox>

        <AvatarWrapper>
          <Avatar
            src={data.avatar ? (data.avatar.startsWith("http") ? data.avatar : `${AVATAR_BASE}${data.avatar}?t=${Date.now()}`) : ""}
            onClick={() => fileRef.current.click()}
          />
          <CameraBtn htmlFor="avatarInput"><FaCamera /></CameraBtn>
          <input
            id="avatarInput"
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setData((prev) => ({
                ...prev,
                avatar: reader.result.includes("data:") ? reader.result : `${AVATAR_BASE}${reader.result}?t=${Date.now()}`
              }));
              reader.readAsDataURL(file);
            }}
          />
        </AvatarWrapper>

        <Label>Full Name</Label>
        <Input value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} />

        <Label>Phone</Label>
        <Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />

        <Label>ID Number (CNIC / Passport)</Label>
        <Input value={data.idNumber} onChange={(e) => setData({ ...data, idNumber: e.target.value })} />

        <Label>Date of Birth</Label>
        <Input type="date" value={data.dob} onChange={(e) => setData({ ...data, dob: e.target.value })} />

        <Label>Bio</Label>
        <TextArea maxLength={250} value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })} />
        <small style={{ color: "#aaa" }}>{data.bio.length}/250</small>

        <SaveBtn whileTap={{ scale: 0.95 }} disabled={saving} onClick={saveProfile}>
          {saving ? "Saving..." : "Save Profile"}
        </SaveBtn>
      </Card>
    </Page>
  );
}
