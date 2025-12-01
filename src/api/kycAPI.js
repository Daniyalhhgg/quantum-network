import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Upload KYC document
export const uploadKYC = async (userId, doc, token) => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("doc", doc);

    const { data } = await api.post("/kyc/submit", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return data; // { status: "pending" | "approved", message, ... }
  } catch (err) {
    console.error("uploadKYC error:", err?.response?.data || err);
    throw err;
  }
};

// Check KYC status
export const getKYCStatus = async (token) => {
  try {
    const { data } = await api.get("/kyc/status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data; // { status: "pending" | "approved" | "rejected" }
  } catch (err) {
    console.error("getKYCStatus error:", err?.response?.data || err);
    throw err;
  }
};
