export const get = (k, fallback = null) => {
  try { return JSON.parse(localStorage.getItem(k) || "null") || fallback; } catch { return fallback; }
};
export const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
