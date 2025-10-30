import api from './api';

export const pedidoService = {
  create: async (pedidoData) => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  uploadComprobante: async (pedidoId, comprobanteFile) => {
    const formData = new FormData();
    formData.append('comprobante', comprobanteFile);
    
    const response = await api.post(
      `/pedidos/${pedidoId}/comprobante`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  getMisPedidos: async () => {
    const response = await api.get('/pedidos/mis-pedidos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  // Admin endpoints
  getAll: async () => {
    const response = await api.get('/pedidos/admin/todos');
    return response.data;
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/pedidos/admin/estado/${estado}`);
    return response.data;
  },

  changeEstado: async (pedidoId, estado) => {
    const response = await api.put(
      `/pedidos/${pedidoId}/estado`,
      null,
      { params: { estado } }
    );
    return response.data;
  },

  getComprobanteUrl: (comprobanteUrl) => {
    if (!comprobanteUrl) return null;
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';
    return `${baseUrl}/uploads/${comprobanteUrl}`;
  }
};

// Estados disponibles
export const EstadoPedido = {
  PENDIENTE: 'PENDIENTE',
  ESPERANDO_VALIDACION: 'ESPERANDO_VALIDACION',
  CONFIRMADO: 'CONFIRMADO',
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO_PARA_ENTREGA: 'LISTO_PARA_ENTREGA',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO'
};
