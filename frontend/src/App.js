import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import NuevoPedido from './pages/NuevoPedido';
import MisPedidos from './pages/MisPedidos';
import Resenas from './pages/Resenas';
import MisResenas from './pages/MisResenas';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminResenas from './pages/admin/AdminResenas';
import AdminProductos from './pages/admin/AdminProductos';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedNav from './components/AnimatedNav';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<AnimatedNav />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/resenas" element={<Resenas />} />
              
              {/* Rutas protegidas de usuario */}
              <Route 
                path="/pedido/nuevo" 
                element={
                  <ProtectedRoute>
                    <NuevoPedido />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mis-pedidos" 
                element={
                  <ProtectedRoute>
                    <MisPedidos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mis-resenas" 
                element={
                  <ProtectedRoute>
                    <MisResenas />
                  </ProtectedRoute>
                } 
              />

              {/* Rutas protegidas de admin */}
              <Route
                path="/admin/pedidos" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPedidos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/resenas" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminResenas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminProductos />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
