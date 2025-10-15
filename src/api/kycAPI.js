export const uploadKYC = async (userId, doc) => {
  // store a simple token
  localStorage.setItem("kyc_status", "pending");
  setTimeout(() => localStorage.setItem("kyc_status", "approved"), 1500);
  return { ok: true, status: "pending" };
};
