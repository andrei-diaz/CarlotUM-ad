import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ChevronDown, MoreVertical } from 'lucide-react';
import InvertedCarousel from '../components/InvertedCarousel';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await productService.getAll();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handlePedido = (producto) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate('/pedido/nuevo', { state: { producto } });
  };

  const toggleLike = (productoId) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productoId)) {
        newSet.delete(productoId);
      } else {
        newSet.add(productoId);
      }
      return newSet;
    });
  };

  const handleShare = (producto) => {
    if (navigator.share) {
      navigator.share({
        title: producto.nombre,
        text: producto.descripcion,
        url: window.location.href,
      });
    } else {
      alert('Compartir: ' + producto.nombre);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando productos...</div>
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

  // Imágenes para el carousel
  const carouselImages = [
    {
      src: "/Carlota1.jpg",
      alt: "Carlota de Limón",
    },
    {
      src: "/Carlota2.jpg",
      alt: "Carlota de Limón",
    },
    {
      src: "/Carlota3.jpg",
      alt: "Carlota de Limón",
    },
    {
      src: "/Carlota4.jpg",
      alt: "Carlota de Limón",
    },
    {
      src: "/Carlota5.jpg",
      alt: "Carlota de Limón",
    },
    {
      src: "/Carlota6.jpg",
      alt: "Carlota de Limón",
    },
  ];

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Reseñas", href: "/resenas" },
    { name: "Mis Pedidos", href: "/mis-pedidos" },
  ];

  return (
    <div className="min-h-screen scale-90 origin-top">
      {/* Sección Hero con TextRoll y Placeholder 3D */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto grid md:grid-cols-[1fr_1.5fr] gap-12 items-center">
          {/* Lado izquierdo: Text Roll Navigation */}
          <div className="flex flex-col justify-center">
            <ul className="flex flex-col gap-0">
              {menuItems.map((item, index) => (
                <li key={index} className="relative flex cursor-pointer overflow-visible">
                  <Link to={item.href} className="relative block overflow-visible">
                    <motion.span
                      initial="initial"
                      whileHover="hovered"
                      className="relative block overflow-hidden whitespace-nowrap leading-none"
                      style={{ lineHeight: 0.75 }}
                    >
                      <motion.div
                        variants={{
                          initial: { y: 0 },
                          hovered: { y: "-100%" },
                        }}
                        transition={{
                          ease: "easeInOut",
                        }}
                        className="text-6xl lg:text-8xl font-extrabold uppercase tracking-tight bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent"
                      >
                        {item.name}
                      </motion.div>
                      <motion.div
                        className="absolute inset-0"
                        variants={{
                          initial: { y: "100%" },
                          hovered: { y: 0 },
                        }}
                        transition={{
                          ease: "easeInOut",
                        }}
                      >
                        <div className="text-6xl lg:text-8xl font-extrabold uppercase tracking-tight bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
                          {item.name}
                        </div>
                      </motion.div>
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lado derecho: Imagen del Limón */}
          <div className="flex items-center justify-end">
            <img 
              src="/lime.png" 
              alt="Limón" 
              className="w-4/5 h-auto object-contain"
              style={{ filter: 'drop-shadow(0 35px 70px rgba(0, 0, 0, 0.4))' }}
            />
          </div>
        </div>
      </section>

      {/* Sección Carousel */}
      <section className="py-32 flex items-center justify-center">
        <div className="w-full">
          <InvertedCarousel 
            images={carouselImages} 
            showPagination 
            loop 
            autoplay
            className="mx-auto scale-[1.6]"
          />
        </div>
      </section>

      {/* Sección de productos */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
            Nuestros Productos
          </h1>
          <p className="text-center text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Cada carlota es única. Elige tu favorita y haz tu pedido.
          </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white dark:bg-gray-800 shadow-lg"
            >
              {/* Header: Precio y Menú */}
              <div className="p-6 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${producto.precio.toFixed(2)}
                  </span>
                  {producto.stockDisponible !== undefined && (
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        producto.stockDisponible > 10 
                          ? 'bg-green-100 text-green-700' 
                          : producto.stockDisponible > 0 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {producto.stockDisponible > 0 
                          ? `${producto.stockDisponible} disponibles` 
                          : 'Sin stock'
                        }
                      </span>
                    </div>
                  )}
                </div>
                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <MoreVertical className="w-6 h-6" />
                </button>
              </div>

              {/* Imagen del producto */}
              {producto.imagenUrl && (
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={productService.getImageUrl(producto.imagenUrl)}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Contenido */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {producto.nombre}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-4">
                  {producto.descripcion}
                </p>
                
                {/* Sección expandible */}
                {expandedCard === producto.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 text-sm"
                  >
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Ingredientes:</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Galleta María, limón natural, leche condensada, crema batida, ralladura de limón.
                    </p>
                  </motion.div>
                )}
              </div>
              
              {/* Footer: Acciones */}
              <div className="px-6 pb-6">
                <div className="flex items-center gap-4 py-3">
                  <button
                    onClick={() => toggleLike(producto.id)}
                    className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart 
                      className="w-5 h-5" 
                      fill={likedProducts.has(producto.id) ? "currentColor" : "none"}
                    />
                  </button>
                  
                  <button
                    onClick={() => handleShare(producto)}
                    className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setExpandedCard(expandedCard === producto.id ? null : producto.id)}
                    className="ml-auto flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform ${expandedCard === producto.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                
                {/* Botón de ordenar */}
                <button
                  onClick={() => handlePedido(producto)}
                  disabled={producto.stockDisponible !== undefined && producto.stockDisponible === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {producto.stockDisponible === 0 ? 'Sin stock' : 'Ordenar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {productos.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 text-xl">
            No hay productos disponibles en este momento
          </div>
        )}
        </div>
      </section>
    </div>
  );
};

export default Productos;
