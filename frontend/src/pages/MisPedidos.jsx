import React, { useState, useEffect } from 'react';
import { pedidoService, EstadoPedido } from '../services/pedidoService';
import { productService } from '../services/productService';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await pedidoService.getMisPedidos();
      setPedidos(data);
    } catch (err) {
      setError('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComprobante = async (pedidoId, file) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo no debe superar 10MB');
      return;
    }

    setUploadingId(pedidoId);
    try {
      await pedidoService.uploadComprobante(pedidoId, file);
      alert('Comprobante subido exitosamente');
      loadPedidos();
    } catch (err) {
      alert('Error al subir comprobante');
    } finally {
      setUploadingId(null);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      [EstadoPedido.PENDIENTE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      [EstadoPedido.ESPERANDO_VALIDACION]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      [EstadoPedido.CONFIRMADO]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      [EstadoPedido.EN_PREPARACION]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      [EstadoPedido.LISTO_PARA_ENTREGA]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      [EstadoPedido.ENTREGADO]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      [EstadoPedido.CANCELADO]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No tienes pedidos todavía
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start gap-4">
                {pedido.producto?.imagenUrl && (
                  <img
                    src={productService.getImageUrl(pedido.producto.imagenUrl)}
                    alt={pedido.producto.nombre}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pedido.producto?.nombre}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Cantidad: {pedido.cantidad}
                      </p>
                      {pedido.notas && (
                        <p className="text-sm text-gray-500 mt-2">
                          Notas: {pedido.notas}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">
                        ${pedido.total?.toFixed(2)}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getEstadoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>
                  </div>

                  {pedido.estado === EstadoPedido.PENDIENTE && !pedido.comprobanteUrl && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-2">
                        Sube tu comprobante de pago para validar tu pedido
                      </p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => handleUploadComprobante(pedido.id, e.target.files[0])}
                        disabled={uploadingId === pedido.id}
                        className="text-sm"
                      />
                      {uploadingId === pedido.id && (
                        <p className="text-sm text-gray-600 mt-2">Subiendo...</p>
                      )}
                    </div>
                  )}

                  {pedido.comprobanteUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ Comprobante subido
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
