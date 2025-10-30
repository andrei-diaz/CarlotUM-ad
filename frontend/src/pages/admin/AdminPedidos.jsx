import React, { useState, useEffect } from 'react';
import { pedidoService, EstadoPedido } from '../../services/pedidoService';
import { productService } from '../../services/productService';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedidos();
  }, [filtro]);

  const loadPedidos = async () => {
    setLoading(true);
    try {
      let data;
      if (filtro === 'TODOS') {
        data = await pedidoService.getAll();
      } else {
        data = await pedidoService.getByEstado(filtro);
      }
      setPedidos(data);
    } catch (err) {
      console.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = async (pedidoId, nuevoEstado) => {
    try {
      await pedidoService.changeEstado(pedidoId, nuevoEstado);
      loadPedidos();
      alert('Estado actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      [EstadoPedido.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
      [EstadoPedido.ESPERANDO_VALIDACION]: 'bg-blue-100 text-blue-800',
      [EstadoPedido.CONFIRMADO]: 'bg-green-100 text-green-800',
      [EstadoPedido.EN_PREPARACION]: 'bg-purple-100 text-purple-800',
      [EstadoPedido.LISTO_PARA_ENTREGA]: 'bg-indigo-100 text-indigo-800',
      [EstadoPedido.ENTREGADO]: 'bg-gray-100 text-gray-800',
      [EstadoPedido.CANCELADO]: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
          Gestión de Pedidos
        </h1>

        {/* Filtros */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltro('TODOS')}
            className={`px-4 py-2 rounded ${filtro === 'TODOS' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Todos
          </button>
          {Object.values(EstadoPedido).map(estado => (
            <button
              key={estado}
              onClick={() => setFiltro(estado)}
              className={`px-4 py-2 rounded text-sm ${filtro === estado ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              {estado.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay pedidos</div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Info del pedido */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">Pedido #{pedido.id}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cliente: {pedido.usuario?.nombre}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email: {pedido.usuario?.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Teléfono: {pedido.usuario?.telefono}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Fecha: {new Date(pedido.fechaPedido).toLocaleString()}
                    </p>
                  </div>

                  {/* Info del producto */}
                  <div>
                    <p className="font-semibold">{pedido.producto?.nombre}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad: {pedido.cantidad}
                    </p>
                    <p className="text-lg font-bold text-primary-600 mt-2">
                      Total: ${pedido.total?.toFixed(2)}
                    </p>
                    {pedido.notas && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Notas: {pedido.notas}
                      </p>
                    )}
                  </div>

                  {/* Estado y acciones */}
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </span>

                    {pedido.comprobanteUrl && (
                      <div className="mb-4">
                        <a
                          href={pedidoService.getComprobanteUrl(pedido.comprobanteUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Ver comprobante →
                        </a>
                      </div>
                    )}

                    <select
                      value={pedido.estado}
                      onChange={(e) => handleChangeEstado(pedido.id, e.target.value)}
                      className="w-full px-3 py-2 border rounded dark:bg-gray-700 text-sm"
                    >
                      {Object.values(EstadoPedido).map(estado => (
                        <option key={estado} value={estado}>
                          {estado.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPedidos;
