import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { pedidoService } from '../services/pedidoService';
import { productService } from '../services/productService';

const NuevoPedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const producto = location.state?.producto;

  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pedidoCreado, setPedidoCreado] = useState(null);

  if (!producto) {
    navigate('/productos');
    return null;
  }

  const total = producto.precio * cantidad;

  const handleComprobanteChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setError('El archivo no debe superar 10MB');
      return;
    }
    setComprobante(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Crear pedido
      const pedido = await pedidoService.create({
        productoId: producto.id,
        cantidad,
        notas,
        lugarEntrega
      });

      setPedidoCreado(pedido);

      // Si hay comprobante, subirlo
      if (comprobante) {
        await pedidoService.uploadComprobante(pedido.id, comprobante);
      }

      alert('Pedido creado exitosamente');
      navigate('/mis-pedidos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Nuevo Pedido</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            {producto.imagenUrl && (
              <img
                src={productService.getImageUrl(producto.imagenUrl)}
                alt={producto.nombre}
                className="w-32 h-32 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {producto.nombre}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {producto.descripcion}
              </p>
              <p className="text-2xl font-bold text-pink-600 mt-4">
                ${producto.precio.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lugar de Entrega *
            </label>
            <input
              type="text"
              required
              value={lugarEntrega}
              onChange={(e) => setLugarEntrega(e.target.value)}
              placeholder="Ej: Edificio A, Planta 3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
            />
            <p className="text-sm text-gray-500 mt-1">
              Especifica dónde quieres recibir tu pedido
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows="3"
              placeholder="Ej: Sin cebolla, entregar a las 2pm, etc."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comprobante de Pago (opcional - puedes subirlo después)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleComprobanteChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
            />
            <p className="text-sm text-gray-500 mt-1">
              Formatos: JPG, PNG, GIF. Máximo 10MB
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span className="text-gray-900 dark:text-white">Total:</span>
              <span className="text-pink-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando pedido...' : 'Confirmar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoPedido;
