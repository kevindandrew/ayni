import api from "./api";

export const publicacionesService = {
  list: (params) => api.get("/publicaciones", { params }),
  get: (id) => api.get(`/publicaciones/${id}`),
  create: (data) => api.post("/publicaciones", data),
  update: (id, data) => api.put(`/publicaciones/${id}`, data),
  delete: (id) => api.delete(`/publicaciones/${id}`),
  cambiarEstado: (id, estado) =>
    api.patch(`/publicaciones/${id}/estado`, { estado }),
  agregarImagen: (id, file, orden = 0) => {
    const form = new FormData();
    form.append("file", file);
    form.append("orden", String(orden));
    return api.post(`/publicaciones/${id}/imagenes`, form);
  },
};
