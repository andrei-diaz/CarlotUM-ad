import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resenaService } from '../services/resenaService';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ResenaCard from '../components/ResenaCard';

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


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando reseñas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent"
        >
          Reseñas de Clientes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
        >
          Lo que dicen nuestros clientes sobre nosotros
        </motion.p>

        {isAuthenticated() && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-16"
          >
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-8 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Escribir una Reseña
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cuéntanos tu experiencia</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Calificación
                  </label>
                  <div className="flex items-center gap-4">
                    <StarRating 
                      value={formData.calificacion} 
                      onChange={(value) => setFormData({ ...formData, calificacion: value })}
                      size={32}
                    />
                    <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {formData.calificacion}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Comentario
                  </label>
                  <textarea
                    value={formData.comentario}
                    onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                    required
                    rows="5"
                    placeholder="Cuéntanos tu experiencia..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Imagen (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Reseña'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {resenas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No hay reseñas todavía. ¡Sé el primero en dejar una!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resenas.map((resena, index) => (
              <motion.div
                key={resena.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ResenaCard resena={resena} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resenas;
