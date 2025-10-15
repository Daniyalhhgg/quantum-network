export const createCircleAPI = async (payload) => {
  return { ok: true, circle: { id: Date.now(), ...payload } };
};
