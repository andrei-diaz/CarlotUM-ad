import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducto();
  }, [id]);

  const loadProducto = async () => {
    try {
      const data = await productService.getById(id);
      setProducto(data);
    } catch (err) {
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handlePedido = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate('/pedido/nuevo', { state: { producto } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error || 'Producto no encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate('/productos')}
          className="mb-8 text-primary-600 hover:text-primary-700 flex items-center gap-2"
        >
          ← Volver a productos
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Imagen */}
          <div>
            {producto.imagenUrl ? (
              <img
                src={productService.getImageUrl(producto.imagenUrl)}
                alt={producto.nombre}
                className="w-full h-auto object-cover shadow-2xl"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
              {producto.nombre}
            </h1>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {producto.descripcion}
            </p>

            <div className="border-t border-b py-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
                ${producto.precio.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePedido}
              className="w-full bg-gradient-to-r from-primary-500 to-lemon-500 hover:from-primary-600 hover:to-lemon-600 text-white py-4 px-8 text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Ordenar Ahora 🍋
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>✓ Entrega personal sin costo extra</p>
              <p>✓ Pago con comprobante bancario</p>
              <p>✓ Disponible todos los días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
