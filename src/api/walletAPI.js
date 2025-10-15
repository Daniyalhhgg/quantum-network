export const getBalance = async (user) => {
  return parseFloat(localStorage.getItem("balance") || "0");
};

export const transfer = async ({ from, to, amount }) => {
  // mock transfer record
  const txs = JSON.parse(localStorage.getItem("txs") || "[]");
  txs.unshift({ id: Date.now(), type: `transfer ${from}->${to}`, amount: -amount, createdAt: Date.now() });
  localStorage.setItem("txs", JSON.stringify(txs));
  return { ok: true };
};
