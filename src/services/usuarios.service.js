import api from "./api";

export const usuariosService = {
  list: (params) => api.get("/users", { params }),
  get: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  deactivate: (id) => api.delete(`/users/${id}`),
  puntos: (id, params) => api.get(`/users/${id}/puntos`, { params }),
  reportes: (id, params) => api.get(`/users/${id}/reportes`, { params }),
};
