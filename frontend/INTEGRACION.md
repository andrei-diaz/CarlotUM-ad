# Integración Frontend-Backend - CarlotUM

## ✅ Integración Completada

El frontend ha sido completamente integrado con el backend. Todos los endpoints están conectados y funcionando.

## 🚀 Cómo usar

### 1. Configuración

El proyecto ya tiene configuradas las URLs del backend:
- **Desarrollo**: `http://localhost:8080/api` (`.env`)
- **Producción**: `http://216.238.79.66:8080/api` (`.env.production`)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el proyecto

```bash
npm start
```

El frontend se abrirá en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── services/           # Servicios API
│   ├── api.js         # Configuración de Axios
│   ├── authService.js # Autenticación
│   ├── productService.js # Productos
│   ├── pedidoService.js # Pedidos
│   └── resenaService.js # Reseñas
├── context/           # Context API
│   └── AuthContext.jsx # Estado de autenticación
├── pages/             # Páginas
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Productos.jsx
│   ├── NuevoPedido.jsx
│   ├── MisPedidos.jsx
│   └── Resenas.jsx
└── components/        # Componentes
    ├── Header.jsx
    ├── ProtectedRoute.jsx
    └── ...
```

## 🔐 Funcionalidades Implementadas

### Autenticación
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Logout
- ✅ Persistencia de sesión (localStorage)
- ✅ Rutas protegidas
- ✅ Header dinámico (muestra usuario logueado)

### Productos
- ✅ Ver todos los productos
- ✅ Ver detalle de producto
- ✅ Imágenes desde el backend

### Pedidos
- ✅ Crear pedido
- ✅ Subir comprobante de pago
- ✅ Ver mis pedidos
- ✅ Estados de pedido con colores

### Reseñas
- ✅ Ver reseñas públicas
- ✅ Crear reseña (requiere login)
- ✅ Subir imagen con reseña
- ✅ Sistema de calificación (1-5 estrellas)

## 🎯 Rutas Disponibles

| Ruta | Requiere Auth | Descripción |
|------|---------------|-------------|
| `/` | No | Página de inicio |
| `/login` | No | Iniciar sesión |
| `/register` | No | Registrarse |
| `/productos` | No | Ver productos |
| `/resenas` | No | Ver reseñas |
| `/pedido/nuevo` | Sí | Crear nuevo pedido |
| `/mis-pedidos` | Sí | Ver mis pedidos |

## 🔧 Servicios API

### authService
```javascript
import { authService } from './services/authService';

// Login
const user = await authService.login(email, contrasena);

// Registro
await authService.register({ nombre, email, telefono, contrasena });

// Logout
authService.logout();

// Obtener usuario actual
const user = authService.getCurrentUser();
```

### productService
```javascript
import { productService } from './services/productService';

// Obtener productos
const productos = await productService.getAll();

// Obtener URL de imagen
const imageUrl = productService.getImageUrl(producto.imagenUrl);
```

### pedidoService
```javascript
import { pedidoService } from './services/pedidoService';

// Crear pedido
const pedido = await pedidoService.create({
  productoId: 1,
  cantidad: 2,
  notas: "Sin cebolla"
});

// Subir comprobante
await pedidoService.uploadComprobante(pedidoId, file);

// Ver mis pedidos
const pedidos = await pedidoService.getMisPedidos();
```

### resenaService
```javascript
import { resenaService } from './services/resenaService';

// Ver reseñas públicas
const resenas = await resenaService.getPublicas();

// Crear reseña
await resenaService.create(comentario, calificacion, pedidoId, imageFile);
```

## 🎨 Context API

### useAuth Hook
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
  
  // Verificar si está autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return <div>Hola {user.nombre}</div>;
}
```

## 🔒 Rutas Protegidas

```javascript
<Route 
  path="/mis-pedidos" 
  element={
    <ProtectedRoute>
      <MisPedidos />
    </ProtectedRoute>
  } 
/>
```

## 📝 Notas Importantes

1. **JWT Token**: Expira en 24 horas (configurado en el backend)
2. **Archivos**: Máximo 10MB
3. **Reseñas**: Requieren aprobación del admin
4. **CORS**: Ya configurado en el backend para `localhost:3000`
5. **Dark Mode**: Implementado con toggle en el Header

## 🐛 Troubleshooting

### Error de CORS
Si el backend está corriendo en un puerto diferente o en producción, actualiza el archivo `.env`:
```
REACT_APP_API_URL=http://tu-servidor:8080/api
```

### Token expirado
El sistema automáticamente redirige al login si el token expira (401).

### Imágenes no cargan
Verifica que el backend esté corriendo y que las URLs estén correctas en los archivos `.env`.

## 🚀 Deploy

Para producción, el archivo `.env.production` ya está configurado con la URL del servidor:
```
REACT_APP_API_URL=http://216.238.79.66:8080/api
```

Build para producción:
```bash
npm run build
```

## 📞 Próximos Pasos

Si necesitas agregar funcionalidad de admin:
1. Crear páginas en `src/pages/admin/`
2. Usar `ProtectedRoute` con `requireAdmin={true}`
3. Los servicios ya tienen los endpoints admin implementados
