import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [theme, setTheme] = useState('light');
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAdminDropdown && !event.target.closest('.admin-dropdown-container')) {
        setShowAdminDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAdminDropdown]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
    } else {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/lime.png" alt="CarlotUM" className="w-12 h-12 object-contain hover:scale-110 transition-transform" />
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
              Inicio
            </Link>
            <Link to="/productos" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
              Productos
            </Link>
            <Link to="/resenas" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
              Reseñas
            </Link>
            {user && !isAdmin() && (
              <>
                <Link to="/mis-pedidos" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                  Mis Pedidos
                </Link>
                <Link to="/mis-resenas" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                  Mis Reseñas
                </Link>
              </>
            )}
            {isAdmin() && (
              <div className="relative admin-dropdown-container">
                <button
                  onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
                >
                  <span>Administración</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showAdminDropdown && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/admin/productos"
                      onClick={() => setShowAdminDropdown(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Productos
                    </Link>
                    <Link
                      to="/admin/pedidos"
                      onClick={() => setShowAdminDropdown(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Pedidos
                    </Link>
                    <Link
                      to="/admin/resenas"
                      onClick={() => setShowAdminDropdown(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Reseñas
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary-100 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-primary-400" />
              )}
            </button>
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user.nombre}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
