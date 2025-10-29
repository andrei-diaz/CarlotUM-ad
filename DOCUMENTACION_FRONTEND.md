# Documentación Backend para Equipo Frontend - CarlotaUm

## 📋 Información General

- **Base URL**: `http://localhost:8080/api`
- **Servidor Producción**: `http://216.238.79.66:8080/api`
- **Autenticación**: JWT Bearer Token
- **Formato**: JSON
- **CORS**: Configurado para `localhost:3000` y `localhost:5173`

## 🔐 Autenticación

### 1. Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "555-1234",
  "contrasena": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Usuario registrado exitosamente"
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "contrasena": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "USER"
}
```

### 3. Usar el Token JWT

En todas las peticiones autenticadas, incluir:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🍽️ Endpoints de Productos

### Obtener Productos Activos
```http
GET /api/productos
```
**Auth**: ❌ No requerida

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Carlota Clásica",
    "descripcion": "Nuestra carlota tradicional...",
    "precio": 25.50,
    "imagenUrl": "productos/abc-123.jpg",
    "activo": true,
    "fechaCreacion": "2024-01-15T10:30:00"
  }
]
```

### Obtener Producto por ID
```http
GET /api/productos/{id}
```
**Auth**: ❌ No requerida

---

### 🔒 ADMIN - Crear Producto
```http
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Carlota Especial",
  "descripcion": "Deliciosa comida casera",
  "precio": 35.00,
  "activo": true
}
```

### 🔒 ADMIN - Subir Imagen de Producto
```http
POST /api/productos/{id}/imagen
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData: imagen (file)
```

**Ejemplo JavaScript:**
```javascript
const formData = new FormData();
formData.append('imagen', imageFile);

fetch(`http://localhost:8080/api/productos/${id}/imagen`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 📦 Endpoints de Pedidos

### Crear Pedido
```http
POST /api/pedidos
Authorization: Bearer {token}
Content-Type: application/json

{
  "productoId": 1,
  "cantidad": 2,
  "notas": "Sin cebolla por favor"
}
```

**Response:**
```json
{
  "id": 1,
  "usuario": { ... },
  "producto": { ... },
  "cantidad": 2,
  "total": 51.00,
  "estado": "PENDIENTE",
  "comprobanteUrl": null,
  "fechaPedido": "2024-01-15T10:30:00",
  "fechaEntrega": null,
  "notas": "Sin cebolla por favor"
}
```

### Subir Comprobante de Pago
```http
POST /api/pedidos/{id}/comprobante
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData: comprobante (file)
```

**Ejemplo JavaScript:**
```javascript
const formData = new FormData();
formData.append('comprobante', comprobanteFile);

fetch(`http://localhost:8080/api/pedidos/${pedidoId}/comprobante`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Response:** Pedido actualizado con estado `ESPERANDO_VALIDACION`

### Obtener Mis Pedidos
```http
GET /api/pedidos/mis-pedidos
Authorization: Bearer {token}
```

**Response:** Array de pedidos del usuario

### Obtener Pedido por ID
```http
GET /api/pedidos/{id}
Authorization: Bearer {token}
```

---

### 🔒 ADMIN - Ver Todos los Pedidos
```http
GET /api/pedidos/admin/todos
Authorization: Bearer {token}
```

### 🔒 ADMIN - Ver Pedidos por Estado
```http
GET /api/pedidos/admin/estado/{estado}
Authorization: Bearer {token}
```

Estados disponibles:
- `PENDIENTE`
- `ESPERANDO_VALIDACION`
- `CONFIRMADO`
- `EN_PREPARACION`
- `LISTO_PARA_ENTREGA`
- `ENTREGADO`
- `CANCELADO`

### 🔒 ADMIN - Cambiar Estado de Pedido
```http
PUT /api/pedidos/{id}/estado?estado=CONFIRMADO
Authorization: Bearer {token}
```

---

## ⭐ Endpoints de Reseñas

### Obtener Reseñas Públicas
```http
GET /api/resenas/publicas
```
**Auth**: ❌ No requerida

**Response:**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 2,
      "nombre": "Juan Pérez"
    },
    "comentario": "¡Excelente comida!",
    "imagenUrl": "resenas/def-789.jpg",
    "calificacion": 5,
    "fecha": "2024-01-15T10:30:00",
    "aprobada": true
  }
]
```

### Crear Reseña
```http
POST /api/resenas
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- comentario (string, requerido)
- calificacion (integer 1-5, requerido)
- pedidoId (integer, opcional)
- imagen (file, opcional)
```

**Ejemplo JavaScript:**
```javascript
const formData = new FormData();
formData.append('comentario', '¡Excelente comida!');
formData.append('calificacion', 5);
formData.append('pedidoId', 1);
formData.append('imagen', imageFile);

fetch('http://localhost:8080/api/resenas', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Obtener Mis Reseñas
```http
GET /api/resenas/mis-resenas
Authorization: Bearer {token}
```

---

### 🔒 ADMIN - Ver Reseñas Pendientes
```http
GET /api/resenas/admin/pendientes
Authorization: Bearer {token}
```

### 🔒 ADMIN - Aprobar Reseña
```http
PUT /api/resenas/{id}/aprobar
Authorization: Bearer {token}
```

### 🔒 ADMIN - Eliminar Reseña
```http
DELETE /api/resenas/{id}
Authorization: Bearer {token}
```

---

## 📁 Manejo de Archivos

### URLs de Archivos

Las imágenes se almacenan en:
- Productos: `uploads/productos/`
- Comprobantes: `uploads/comprobantes/`
- Reseñas: `uploads/resenas/`

**Para mostrar imágenes:**
```javascript
const imageUrl = `http://localhost:8080/uploads/${imagenUrl}`;
// Ejemplo: http://localhost:8080/uploads/productos/abc-123.jpg
```

**Límites:**
- Tamaño máximo: **10MB**
- Formatos soportados: JPG, PNG, GIF

---

## 🔄 Estados del Pedido

| Estado | Descripción | Quién lo cambia |
|--------|-------------|-----------------|
| `PENDIENTE` | Pedido creado, esperando comprobante | Sistema (al crear) |
| `ESPERANDO_VALIDACION` | Comprobante subido | Usuario (al subir comprobante) |
| `CONFIRMADO` | Pago validado | Admin |
| `EN_PREPARACION` | Comida en preparación | Admin |
| `LISTO_PARA_ENTREGA` | Listo para recoger | Admin |
| `ENTREGADO` | Entregado al cliente | Admin |
| `CANCELADO` | Pedido cancelado | Admin |

---

## 🚨 Códigos de Error HTTP

| Código | Significado | Acción recomendada |
|--------|-------------|-------------------|
| **400** | Bad Request | Validar datos del formulario |
| **401** | Unauthorized | Token inválido, redirigir a login |
| **403** | Forbidden | Usuario no tiene permisos |
| **404** | Not Found | Recurso no existe |
| **500** | Server Error | Mostrar error genérico |

---

## 💡 Ejemplo de Implementación (React + Axios)

### Configuración de Axios
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Servicio de Autenticación
```javascript
import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, contrasena) => {
    const response = await api.post('/auth/login', { email, contrasena });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};
```

### Servicio de Productos
```javascript
import api from './api';

export const productService = {
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  create: async (producto) => {
    const response = await api.post('/productos', producto);
    return response.data;
  },

  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    
    const response = await api.post(`/productos/${id}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
```

### Servicio de Pedidos
```javascript
import api from './api';

export const pedidoService = {
  create: async (pedidoData) => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  uploadComprobante: async (pedidoId, comprobanteFile) => {
    const formData = new FormData();
    formData.append('comprobante', comprobanteFile);
    
    const response = await api.post(
      `/pedidos/${pedidoId}/comprobante`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  getMisPedidos: async () => {
    const response = await api.get('/pedidos/mis-pedidos');
    return response.data;
  },

  // Admin
  getAll: async () => {
    const response = await api.get('/pedidos/admin/todos');
    return response.data;
  },

  changeEstado: async (pedidoId, estado) => {
    const response = await api.put(
      `/pedidos/${pedidoId}/estado`,
      null,
      { params: { estado } }
    );
    return response.data;
  }
};
```

### Servicio de Reseñas
```javascript
import api from './api';

export const resenaService = {
  getPublicas: async () => {
    const response = await api.get('/resenas/publicas');
    return response.data;
  },

  create: async (comentario, calificacion, pedidoId, imageFile) => {
    const formData = new FormData();
    formData.append('comentario', comentario);
    formData.append('calificacion', calificacion);
    if (pedidoId) formData.append('pedidoId', pedidoId);
    if (imageFile) formData.append('imagen', imageFile);
    
    const response = await api.post('/resenas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getMisResenas: async () => {
    const response = await api.get('/resenas/mis-resenas');
    return response.data;
  }
};
```

---

## 🎯 Flujo de Usuario Típico

### Cliente (USER)
1. ✅ Registro → `POST /auth/register`
2. ✅ Login → `POST /auth/login` (Guardar token)
3. ✅ Ver productos → `GET /productos`
4. ✅ Crear pedido → `POST /pedidos`
5. ✅ Subir comprobante → `POST /pedidos/{id}/comprobante`
6. ✅ Ver mis pedidos → `GET /pedidos/mis-pedidos`
7. ✅ Crear reseña → `POST /resenas`
8. ✅ Ver reseñas → `GET /resenas/publicas`

### Admin (ADMIN)
1. ✅ Login → `POST /auth/login`
2. ✅ Ver pedidos pendientes → `GET /pedidos/admin/estado/ESPERANDO_VALIDACION`
3. ✅ Validar pago → `PUT /pedidos/{id}/estado?estado=CONFIRMADO`
4. ✅ Actualizar estado → `PUT /pedidos/{id}/estado?estado=EN_PREPARACION`
5. ✅ Ver reseñas pendientes → `GET /resenas/admin/pendientes`
6. ✅ Aprobar reseña → `PUT /resenas/{id}/aprobar`

---

## ⚙️ Configuración del Servidor

### Información de la Base de Datos
- **Host**: `216.238.79.66`
- **Puerto**: `5432`
- **Base de datos**: `carlotum`
- **Usuario**: `enarmdev`

### Información del Backend
- **Puerto**: `8080`
- **URL Local**: `http://localhost:8080`
- **URL Producción**: `http://216.238.79.66:8080`

---

## 📝 Notas Importantes

1. **Token JWT**: Expira en **24 horas**
2. **Archivos**: Máximo **10MB**
3. **Reseñas**: Requieren aprobación del admin para ser públicas
4. **Comprobantes**: Solo se pueden subir en pedidos con estado `PENDIENTE`
5. **CORS**: Ya configurado para React (ports 3000 y 5173)

---

## 🐛 Troubleshooting

### Error 401 (Unauthorized)
- Verificar que el token esté incluido en el header
- Token puede haber expirado (24h)
- Solicitar nuevo login

### Error 403 (Forbidden)
- Usuario no tiene rol ADMIN
- Verificar permisos del endpoint

### Error de CORS
- Backend ya tiene CORS configurado para localhost:3000 y localhost:5173
- Si usas otro puerto, notificar al backend

### Imágenes no cargan
- Verificar que la URL sea: `http://localhost:8080/uploads/{imagenUrl}`
- El campo `imagenUrl` ya incluye el subdirectorio (ej: `productos/abc-123.jpg`)

---

## 📞 Contacto

Para dudas técnicas sobre la API, contactar al equipo de backend.

**Estado del Backend**: ✅ Funcionando (puerto 8080)
