export const optInMarketplace = async (userId) => {
  localStorage.setItem("market_opt_in", "yes");
  return { ok: true };
};
