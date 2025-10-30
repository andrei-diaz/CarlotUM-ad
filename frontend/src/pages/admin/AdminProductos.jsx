import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    activo: true
  });
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await productService.getAll();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear producto
      const nuevoProducto = await productService.create({
        ...formData,
        precio: parseFloat(formData.precio)
      });

      // Si hay imagen, subirla
      if (imagen) {
        await productService.uploadImage(nuevoProducto.id, imagen);
      }

      alert('Producto creado exitosamente');
      setShowForm(false);
      setFormData({ nombre: '', descripcion: '', precio: '', activo: true });
      setImagen(null);
      loadProductos();
    } catch (err) {
      alert('Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (productoId, file) => {
    try {
      await productService.uploadImage(productoId, file);
      alert('Imagen subida exitosamente');
      loadProductos();
    } catch (err) {
      alert('Error al subir imagen');
    }
  };

  const handleStockUpdate = async (productoId) => {
    const stockNum = parseInt(stockValue);
    if (isNaN(stockNum) || stockNum < 0) {
      alert('Ingrese un número válido');
      return;
    }

    try {
      await productService.updateStock(productoId, stockNum);
      alert('Stock actualizado exitosamente');
      setEditingStock(null);
      setStockValue('');
      loadProductos();
    } catch (err) {
      alert('Error al actualizar stock');
    }
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent py-20 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent">
            Gestión de Productos
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-primary-500 to-lemon-500 hover:from-primary-600 hover:to-lemon-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
          >
            {showForm ? 'Cancelar' : '+ Nuevo Producto'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  required
                  rows="3"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Imagen (opcional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={(e) => setImagen(e.target.files[0])}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Producto activo</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-lemon-500 hover:from-primary-600 hover:to-lemon-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Producto'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {producto.imagenUrl ? (
                <img
                  src={productService.getImageUrl(producto.imagenUrl)}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{producto.nombre}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{producto.descripcion}</p>
                <p className="text-2xl font-bold text-primary-600 mb-4">
                  ${producto.precio.toFixed(2)}
                </p>

                {/* Stock */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Stock Disponible:</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      (producto.stockDisponible || 0) > 10 
                        ? 'bg-green-200 text-green-800' 
                        : (producto.stockDisponible || 0) > 0 
                        ? 'bg-yellow-200 text-yellow-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {producto.stockDisponible || 0}
                    </span>
                  </div>
                  
                  {editingStock === producto.id ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        min="0"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        placeholder="Nuevo stock"
                        className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-600 dark:border-gray-500"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleStockUpdate(producto.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-bold"
                        >
                          ✔️ Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStock(null);
                            setStockValue('');
                          }}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStock(producto.id);
                        setStockValue(String(producto.stockDisponible || 0));
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md hover:shadow-lg"
                    >
                      📦 Actualizar Stock
                    </button>
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Cambiar imagen:
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(producto.id, e.target.files[0]);
                        }
                      }}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {producto.activo ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProductos;
