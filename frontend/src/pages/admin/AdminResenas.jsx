import React, { useState, useEffect } from 'react';
import { resenaService } from '../../services/resenaService';

const AdminResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [mostrar, setMostrar] = useState('PENDIENTES');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResenas();
  }, [mostrar]);

  const loadResenas = async () => {
    setLoading(true);
    try {
      const data = mostrar === 'PENDIENTES' 
        ? await resenaService.getPendientes()
        : await resenaService.getPublicas();
      setResenas(data);
    } catch (err) {
      console.error('Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id) => {
    try {
      await resenaService.aprobar(id);
      alert('Reseña aprobada exitosamente');
      loadResenas();
    } catch (err) {
      alert('Error al aprobar reseña');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta reseña?')) return;
    
    try {
      await resenaService.delete(id);
      alert('Reseña eliminada');
      loadResenas();
    } catch (err) {
      alert('Error al eliminar reseña');
    }
  };

  const renderStars = (calificacion) => {
    return '⭐'.repeat(calificacion);
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent py-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
          Gestión de Reseñas
        </h1>

        {/* Filtros */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setMostrar('PENDIENTES')}
            className={`px-4 py-2 rounded ${mostrar === 'PENDIENTES' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setMostrar('APROBADAS')}
            className={`px-4 py-2 rounded ${mostrar === 'APROBADAS' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Aprobadas
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : resenas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay reseñas {mostrar === 'PENDIENTES' ? 'pendientes' : 'aprobadas'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resenas.map((resena) => (
              <div key={resena.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {resena.imagenUrl && (
                  <img
                    src={resenaService.getImageUrl(resena.imagenUrl)}
                    alt="Reseña"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="text-2xl mb-2">{renderStars(resena.calificacion)}</div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {resena.comentario}
                </p>
                
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {resena.usuario?.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(resena.fecha).toLocaleString()}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  {!resena.aprobada && (
                    <button
                      onClick={() => handleAprobar(resena.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                    >
                      Aprobar
                    </button>
                  )}
                  <button
                    onClick={() => handleEliminar(resena.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResenas;
