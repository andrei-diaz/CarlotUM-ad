import api from './api';

export const resenaService = {
  getPublicas: async () => {
    const response = await api.get('/resenas/publicas');
    return response.data;
  },

  create: async (comentario, calificacion, pedidoId = null, imageFile = null) => {
    const formData = new FormData();
    formData.append('comentario', comentario);
    formData.append('calificacion', calificacion);
    if (pedidoId) formData.append('pedidoId', pedidoId);
    if (imageFile) formData.append('imagen', imageFile);
    
    const response = await api.post('/resenas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getMisResenas: async () => {
    const response = await api.get('/resenas/mis-resenas');
    return response.data;
  },

  // Admin endpoints
  getPendientes: async () => {
    const response = await api.get('/resenas/admin/pendientes');
    return response.data;
  },

  aprobar: async (id) => {
    const response = await api.put(`/resenas/${id}/aprobar`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resenas/${id}`);
    return response.data;
  },

  getImageUrl: (imagenUrl) => {
    if (!imagenUrl) return null;
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';
    return `${baseUrl}/uploads/${imagenUrl}`;
  }
};
