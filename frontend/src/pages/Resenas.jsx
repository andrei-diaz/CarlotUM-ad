import React, { useState, useEffect } from 'react';
import { resenaService } from '../services/resenaService';
import { useAuth } from '../context/AuthContext';

const Resenas = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    comentario: '',
    calificacion: 5,
    imagen: null
  });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadResenas();
  }, []);

  const loadResenas = async () => {
    try {
      const data = await resenaService.getPublicas();
      setResenas(data);
    } catch (err) {
      console.error('Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await resenaService.create(
        formData.comentario,
        formData.calificacion,
        null,
        formData.imagen
      );
      alert('Reseña enviada. Será publicada después de ser aprobada por un administrador.');
      setShowForm(false);
      setFormData({ comentario: '', calificacion: 5, imagen: null });
    } catch (err) {
      alert('Error al enviar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (calificacion) => {
    return '⭐'.repeat(calificacion);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando reseñas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Reseñas de Clientes</h1>

      {isAuthenticated() && (
        <div className="max-w-2xl mx-auto mb-12">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Escribir una Reseña
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calificación
                </label>
                <select
                  value={formData.calificacion}
                  onChange={(e) => setFormData({ ...formData, calificacion: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{renderStars(num)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comentario
                </label>
                <textarea
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                  required
                  rows="4"
                  placeholder="Cuéntanos tu experiencia..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imagen (opcional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Enviar Reseña'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resenas.map((resena) => (
          <div
            key={resena.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
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
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {resena.usuario?.nombre}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(resena.fecha).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {resenas.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No hay reseñas todavía. ¡Sé el primero en dejar una!
        </div>
      )}
    </div>
  );
};

export default Resenas;
