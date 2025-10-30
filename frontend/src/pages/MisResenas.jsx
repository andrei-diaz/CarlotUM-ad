import React, { useState, useEffect } from 'react';
import { resenaService } from '../services/resenaService';

const MisResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResenas();
  }, []);

  const loadResenas = async () => {
    try {
      const data = await resenaService.getMisResenas();
      setResenas(data);
    } catch (err) {
      setError('Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (calificacion) => {
    return '⭐'.repeat(calificacion);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
          Mis Reseñas
        </h1>

        {resenas.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 text-xl">
            No has escrito ninguna reseña todavía
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resenas.map((resena) => (
              <div
                key={resena.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative"
              >
                {!resena.aprobada && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Pendiente
                  </div>
                )}
                {resena.aprobada && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Aprobada
                  </div>
                )}
                
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
                
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    {new Date(resena.fecha).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisResenas;
