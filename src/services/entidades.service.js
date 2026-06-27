import api from "./api";

export const entidadesService = {
  list: (params) => api.get("/entidades", { params }),
  get: (id) => api.get(`/entidades/${id}`),
};
