import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pedidoService } from '../../services/pedidoService';
import { resenaService } from '../../services/resenaService';
import { productService } from '../../services/productService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    resenasPendientes: 0,
    totalProductos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [pedidos, resenas, productos] = await Promise.all([
        pedidoService.getAll(),
        resenaService.getPendientes(),
        productService.getAll()
      ]);

      setStats({
        totalPedidos: pedidos.length,
        pedidosPendientes: pedidos.filter(p => p.estado === 'ESPERANDO_VALIDACION').length,
        resenasPendientes: resenas.length,
        totalProductos: productos.length
      });
    } catch (err) {
      console.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold mb-12 bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
          Panel de Administración
        </h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Total Pedidos</h3>
            <p className="text-4xl font-bold text-primary-600 mt-2">{stats.totalPedidos}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Pedidos Pendientes</h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pedidosPendientes}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Reseñas Pendientes</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.resenasPendientes}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Total Productos</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalProductos}</p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/pedidos"
            className="bg-gradient-to-r from-primary-500 to-lemon-500 hover:from-primary-600 hover:to-lemon-600 text-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">📦 Gestionar Pedidos</h2>
            <p className="text-white/80">Ver y actualizar estado de pedidos</p>
          </Link>

          <Link
            to="/admin/resenas"
            className="bg-gradient-to-r from-primary-500 to-lemon-500 hover:from-primary-600 hover:to-lemon-600 text-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">⭐ Gestionar Reseñas</h2>
            <p className="text-white/80">Aprobar o eliminar reseñas</p>
          </Link>

          <Link
            to="/admin/productos"
            className="bg-gradient-to-r from-primary-500 to-lemon-500 hover:from-primary-600 hover:to-lemon-600 text-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">🍋 Gestionar Productos</h2>
            <p className="text-white/80">Crear y editar productos</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
