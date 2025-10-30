import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar } from 'lucide-react';
import StarRating from './StarRating';
import { resenaService } from '../services/resenaService';

const ResenaCard = ({ resena, showStatus = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Badge de estado */}
      {showStatus && (
        <div className="absolute top-4 right-4 z-10">
          {resena.aprobada ? (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 shadow-lg flex items-center gap-1">
              <span>✓</span> Aprobada
            </span>
          ) : (
            <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 shadow-lg flex items-center gap-1">
              <span>⏳</span> Pendiente
            </span>
          )}
        </div>
      )}

      {/* Imagen */}
      {resena.imagenUrl && (
        <div className="relative h-56 overflow-hidden">
          <img
            src={resenaService.getImageUrl(resena.imagenUrl)}
            alt="Reseña"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        {/* Estrellas */}
        <div className="flex items-center gap-2 mb-4">
          <StarRating value={resena.calificacion} readonly size={20} />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {resena.calificacion}/5
          </span>
        </div>

        {/* Comentario */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-4">
          "{resena.comentario}"
        </p>

        {/* Footer con info del usuario */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-lemon-400 flex items-center justify-center text-white font-bold shadow-lg">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {resena.usuario?.nombre || 'Usuario'}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} />
                {new Date(resena.fecha).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResenaCard;
