// mock PoE API
export const postPoE = async (token, eventType) => {
  // in real: POST /api/poe/event
  return { ok: true, event: { eventType, amount: 0.5, timestamp: Date.now() } };
};
