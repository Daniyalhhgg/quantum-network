// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiCamera, FiMapPin, FiSave, FiUser, FiMail, FiGlobe, FiPhone, FiShield, FiCheck } from "react-icons/fi";
// ↑ Yeh sab icons 100% exist karte hain react-icons/fi mein

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e1f 0%, #050812 100%);
  color: #e0f8ff;
  font-family: 'Inter', sans-serif;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  background: rgba(15, 25, 50, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 245, 160, 0.3);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 245, 160, 0.15);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.4rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #88aabb;
  margin-bottom: 2rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 2rem;
`;

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: ${p => p.src ? `url(${p.src}) center/cover no-repeat` : "linear-gradient(135deg, #00f5a0, #00d9f5)"};
  border: 5px solid #00f5a0;
  box-shadow: 0 0 50px rgba(0, 245, 160, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  color: #000;
`;

const CameraBtn = styled.label`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #00f5a0;
  color: #000;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 245, 160, 0.6);
  input { display: none; }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
`;

const Icon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #00f5a0;
  font-size: 1.3rem;
  z-index: 2;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 18px 18px 56px;
  border-radius: 16px;
  border: 1px solid rgba(0, 245, 160, 0.3);
  background: rgba(10, 20, 40, 0.7);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
  &:focus {
    border-color: #00f5a0;
    box-shadow: 0 0 25px rgba(0, 245, 160, 0.4);
  }
`;

const LocationBox = styled.div`
  background: ${p => p.allowed ? "rgba(0, 245, 160, 0.15)" : "rgba(0, 245, 160, 0.08)"};
  border: 2px dashed ${p => p.allowed ? "#00f5a0" : "#00f5a0"};
  padding: 1.8rem;
  border-radius: 18px;
  text-align: center;
  cursor: ${p => p.allowed ? "default" : "pointer"};
  transition: all 0.3s;
`;

const SaveBtn = styled(motion.button)`
  width: 100%;
  padding: 18px;
  margin-top: 2rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(90deg, #00f5a0, #00d9f5);
  color: #000;
  font-weight: 800;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(0, 245, 160, 0.5);
`;

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "", lastName: "", country: "", phone: "", idCard: "", email: "", photo: "", ip: "", allowed: false
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    setProfile({
      email: userInfo.email || "user@example.com",
      name: savedProfile.name || userInfo.name || "",
      lastName: savedProfile.lastName || "",
      country: savedProfile.country || "",
      phone: savedProfile.phone || "",
      idCard: savedProfile.idCard || "",
      photo: savedProfile.photo || "",
      ip: savedProfile.ip || "",
      allowed: savedProfile.allowed || false
    });
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile(p => ({ ...p, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const detectLocation = () => {
    if (profile.allowed) return;
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        setProfile(p => ({
          ...p,
          ip: data.ip,
          country: data.country_name || "Unknown",
          allowed: true
        }));
        alert(`Device Locked!\nCountry: ${data.country_name}\nIP: ${data.ip}\n1 Device = 1 Account`);
      })
      .catch(() => alert("Failed to detect location"));
  };

  const save = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile Saved Successfully!");
  };

  return (
    <Page>
      <Container initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Title>My Profile</Title>
        <Subtitle>1 Device = 1 Account • Complete your info</Subtitle>

        <AvatarWrapper>
          <Avatar src={profile.photo}>
            {!profile.photo && (profile.name.charAt(0) || "U")}
          </Avatar>
          <CameraBtn>
            <FiCamera size={20} />
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </CameraBtn>
        </AvatarWrapper>

        <InputGroup>
          <Icon><FiMail /></Icon>
          <Input value={profile.email} disabled placeholder="Email" />
        </InputGroup>

        <InputGroup>
          <Icon><FiUser /></Icon>
          <Input placeholder="First Name" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} />
        </InputGroup>

        <InputGroup>
          <Icon><FiUser /></Icon>
          <Input placeholder="Last Name" value={profile.lastName} onChange={e => setProfile(p => ({...p, lastName: e.target.value}))} />
        </InputGroup>

        <InputGroup>
          <Icon><FiGlobe /></Icon>
          <Input placeholder="Country" value={profile.country} disabled={profile.allowed} />
        </InputGroup>

        <InputGroup>
          <Icon><FiPhone /></Icon>
          <Input placeholder="Phone Number" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} />
        </InputGroup>

        <InputGroup>
          <Icon><FiShield /></Icon>
          <Input placeholder="ID Card / Passport Number" value={profile.idCard} onChange={e => setProfile(p => ({...p, idCard: e.target.value}))} />
        </InputGroup>

        <LocationBox allowed={profile.allowed} onClick={detectLocation}>
          {profile.allowed ? (
            <>
              <FiCheck size={36} color="#00f5a0" />
              <p style={{margin: "12px 0 0", fontWeight: "bold"}}>Device Verified</p>
              <small>{profile.country} • {profile.ip}</small>
            </>
          ) : (
            <>
              <FiMapPin size={36} color="#00f5a0" />
              <p style={{margin: "12px 0 0", fontWeight: "bold"}}>Tap to Lock Device</p>
              <small>1 Device = 1 Account Policy</small>
            </>
          )}
        </LocationBox>

        <SaveBtn whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={save}>
          <FiSave style={{marginRight: "10px"}} /> Save Profile
        </SaveBtn>
      </Container>
    </Page>
  );
}