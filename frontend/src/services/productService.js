import api from './api';

export const productService = {
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  create: async (producto) => {
    const response = await api.post('/productos', producto);
    return response.data;
  },

  update: async (id, producto) => {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },

  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    
    const response = await api.post(`/productos/${id}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateStock: async (id, stock) => {
    const response = await api.put(`/productos/${id}/stock`, null, {
      params: { stock }
    });
    return response.data;
  },

  getImageUrl: (imagenUrl) => {
    if (!imagenUrl) return null;
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';
    return `${baseUrl}/uploads/${imagenUrl}`;
  }
};
