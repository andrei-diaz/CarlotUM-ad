import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resenaService } from '../services/resenaService';
import ResenaCard from '../components/ResenaCard';

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
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent"
        >
          Mis Reseñas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
        >
          Gestiona todas tus reseñas en un solo lugar
        </motion.p>

        {resenas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              No has escrito ninguna reseña todavía
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              ¡Comparte tu experiencia con nosotros!
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
                <ResenaCard resena={resena} showStatus={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisResenas;
