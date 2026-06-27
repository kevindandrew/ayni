import api from "./api";

export const reportesService = {
  list: (params) => api.get("/reportes", { params }),
  listPendientes: (params) => api.get("/reportes/pendientes", { params }),
  get: (id) => api.get(`/reportes/${id}`),
  create: (data) => api.post("/reportes", data),
  update: (id, data) => api.put(`/reportes/${id}`, data),
  delete: (id) => api.delete(`/reportes/${id}`),
  marcarEncontrado: (id, estado_resolucion) =>
    api.patch(`/reportes/${id}/encontrado`, { estado_resolucion }),
  validar: (id, data) => api.post(`/reportes/${id}/validar`, data),
  agregarImagen: (id, file, orden = 0) => {
    const form = new FormData();
    form.append("file", file);
    form.append("orden", String(orden));
    return api.post(`/reportes/${id}/imagenes`, form);
  },
  eliminarImagen: (reporteId, imagenId) =>
    api.delete(`/reportes/${reporteId}/imagenes/${imagenId}`),
};
