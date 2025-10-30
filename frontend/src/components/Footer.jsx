import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md mt-20 border-t border-primary-100 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🍋</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-lemon-500 bg-clip-text text-transparent">
                CarlotUM
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Carlota de limón artesanal hecha con amor y los mejores ingredientes.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Contacto</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>📧 contacto@carlotum.com</li>
              <li>📱 WhatsApp: +52 999 123 4567</li>
              <li>📍 Mérida, Yucatán</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transform hover:-translate-y-1 transition-all">
                <span>📘</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-primary-400 to-lemon-400 rounded-full flex items-center justify-center text-white hover:shadow-lg transform hover:-translate-y-1 transition-all">
                <span>📷</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-lemon-400 to-lemon-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transform hover:-translate-y-1 transition-all">
                <span>🐦</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-100 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 CarlotUM. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
