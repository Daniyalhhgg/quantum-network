// mock auth API
export const signup = async (data) => {
  // In real: POST /api/auth/signup
  localStorage.setItem("mock_user", JSON.stringify(data));
  return { ok: true, user: data };
};

export const login = async (data) => {
  const user = JSON.parse(localStorage.getItem("mock_user") || "null");
  if (!user) throw new Error("No user");
  return { ok: true, user };
};
