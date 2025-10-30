# 🎯 Cambios Implementados - CarlotaUm

## 📦 Nuevas Funcionalidades

### 1. ✅ **Sistema de Stock para Productos**

**¿Qué hace?**
- Los productos ahora tienen un campo `stockDisponible` (cantidad disponible)
- Solo se muestran productos con stock > 0 a los clientes
- El stock se reduce automáticamente al crear un pedido
- Admin puede actualizar el stock diariamente

**Endpoints nuevos:**
```http
PUT /api/productos/{id}/stock?stock=50
Authorization: Bearer {admin-token}
```

**Ejemplo:**
```javascript
// Admin actualiza el stock del día
await api.put('/productos/1/stock', null, {
  params: { stock: 30 }
});
```

---

### 2. 📍 **Lugar de Entrega en Pedidos**

**¿Qué hace?**
- Los pedidos ahora requieren especificar un lugar de entrega
- Campo obligatorio al crear un pedido
- Pensado para lugares dentro de la universidad

**Cambios en el pedido:**
```javascript
// Antes
{
  "productoId": 1,
  "cantidad": 2,
  "notas": "Sin cebolla"
}

// Ahora
{
  "productoId": 1,
  "cantidad": 2,
  "notas": "Sin cebolla",
  "lugarEntrega": "Edificio A, Planta 3" // ⬅️ NUEVO
}
```

---

### 3. 📧 **Notificaciones por Email**

**¿Qué hace?**
- Cuando un usuario sube el comprobante → El admin recibe un email
- Cuando el admin confirma el pago → El usuario recibe un email

**Flujo de emails:**

1. **Usuario sube comprobante** → Admin recibe:
   ```
   🍽️ Nuevo Pedido #123 - CarlotaUm
   
   ¡Nuevo pedido recibido!
   
   📋 Detalles del Pedido:
   Cliente: Juan Pérez
   Email: juan@example.com
   Teléfono: 555-1234
   
   🍽️ Producto:
   Nombre: Carlota Clásica
   Cantidad: 2
   Total: $50.00
   
   📍 Lugar de entrega: Edificio A, Planta 3
   💳 Estado: ESPERANDO_VALIDACION
   ```

2. **Admin confirma pago** → Usuario recibe:
   ```
   ✅ Pago Confirmado - Pedido #123
   
   ¡Hola Juan!
   
   Tu pago ha sido confirmado exitosamente. ✅
   
   Tu pedido está siendo preparado.
   Te notificaremos cuando esté listo para recoger.
   ```

---

### 4. 🔄 **Validación de Stock**

**¿Qué hace?**
- Antes de crear un pedido, valida que haya stock suficiente
- Si no hay stock, devuelve error claro
- Al crear pedido, reduce el stock automáticamente

**Ejemplo de error:**
```json
{
  "error": "Stock insuficiente. Solo hay 5 unidades disponibles"
}
```

---

## 📊 Cambios en la Base de Datos

### Tabla `productos`
```sql
-- Nueva columna
ALTER TABLE productos 
ADD COLUMN stock_disponible INTEGER NOT NULL DEFAULT 0;
```

### Tabla `pedidos`
```sql
-- Nueva columna
ALTER TABLE pedidos 
ADD COLUMN lugar_entrega VARCHAR(255) NOT NULL;
```

---

## 🔐 Estados del Pedido (Explicación Completa)

### Flujo Normal de un Pedido:

```
1. PENDIENTE
   ↓
   Usuario crea el pedido
   (Stock se reduce aquí)
   
2. ESPERANDO_VALIDACION
   ↓
   Usuario sube comprobante de transferencia
   📧 Email enviado al ADMIN
   
3. CONFIRMADO
   ↓
   Admin valida el pago en el banco
   📧 Email enviado al USUARIO
   
4. EN_PREPARACION
   ↓
   Admin está preparando la comida
   
5. LISTO_PARA_ENTREGA
   ↓
   Comida lista para recoger en el lugar especificado
   
6. ENTREGADO
   ↓
   Usuario recogió su pedido
   (Se registra fecha_entrega)
   
7. CANCELADO (Opcional)
   ↓
   Admin o Usuario cancela el pedido
   (⚠️ Stock NO se devuelve automáticamente)
```

### Explicación de Cada Estado:

| Estado | Descripción | Quién lo cambia |
|--------|-------------|-----------------|
| **PENDIENTE** | Pedido recién creado, usuario aún no paga | Sistema (automático) |
| **ESPERANDO_VALIDACION** | Usuario ya subió comprobante, esperando que admin valide | Usuario (al subir comprobante) |
| **CONFIRMADO** | Admin verificó el pago en el banco | Admin (manual) |
| **EN_PREPARACION** | Comida en proceso de preparación | Admin (manual) |
| **LISTO_PARA_ENTREGA** | Comida lista, esperando que el usuario recoja | Admin (manual) |
| **ENTREGADO** | Usuario recogió su pedido | Admin (manual) |
| **CANCELADO** | Pedido cancelado por alguna razón | Admin (manual) |

---

## ⚙️ Configuración de Email

### Paso 1: Configurar en `application.properties`

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Email del administrador
app.admin.email=admin@carlotaum.com
```

### Paso 2: Obtener App Password de Gmail

1. Ir a https://myaccount.google.com/security
2. Activar "Verificación en 2 pasos"
3. Ir a "Contraseñas de aplicaciones"
4. Generar nueva contraseña para "Correo"
5. Copiar la contraseña generada
6. Pegarla en `spring.mail.password`

### Alternativas a Gmail:

**Outlook/Hotmail:**
```properties
spring.mail.host=smtp.office365.com
spring.mail.port=587
```

**Yahoo:**
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
```

### ⚠️ Modo sin Email (Para pruebas)

Si no configuras el email, las notificaciones se imprimen en la consola:

```
=== NOTIFICACIÓN DE NUEVO PEDIDO ===
Pedido ID: 1
Cliente: Juan Pérez
Producto: Carlota Clásica
Cantidad: 2
Total: $50.00
Lugar de entrega: Edificio A
Estado: ESPERANDO_VALIDACION
====================================
```

---

## 🎯 Flujo Completo de Uso

### Para el Usuario:

1. **Ver productos disponibles**
   ```http
   GET /api/productos
   ```
   → Solo muestra productos con stock > 0

2. **Crear pedido**
   ```http
   POST /api/pedidos
   {
     "productoId": 1,
     "cantidad": 2,
     "lugarEntrega": "Edificio A, Planta 3",
     "notas": "Sin cebolla"
   }
   ```
   → Stock se reduce automáticamente
   → Estado: PENDIENTE

3. **Subir comprobante**
   ```http
   POST /api/pedidos/1/comprobante
   FormData: comprobante (imagen)
   ```
   → Estado cambia a: ESPERANDO_VALIDACION
   → 📧 Admin recibe email

4. **Esperar confirmación**
   → Admin valida pago
   → 📧 Usuario recibe email de confirmación

5. **Recoger pedido**
   → Cuando estado sea: LISTO_PARA_ENTREGA
   → Ir al lugar especificado

---

### Para el Admin:

1. **Configurar stock diario**
   ```http
   PUT /api/productos/1/stock?stock=30
   ```

2. **Ver pedidos pendientes**
   ```http
   GET /api/pedidos/admin/estado/ESPERANDO_VALIDACION
   ```

3. **Validar pagos**
   - Revisar comprobante
   - Si es válido:
   ```http
   PUT /api/pedidos/1/estado?estado=CONFIRMADO
   ```
   → 📧 Usuario recibe confirmación

4. **Actualizar estados según avance**
   ```http
   PUT /api/pedidos/1/estado?estado=EN_PREPARACION
   PUT /api/pedidos/1/estado?estado=LISTO_PARA_ENTREGA
   PUT /api/pedidos/1/estado?estado=ENTREGADO
   ```

---

## 🚀 Endpoints Nuevos

### Productos

```http
# Actualizar stock (Admin)
PUT /api/productos/{id}/stock?stock={cantidad}
Authorization: Bearer {admin-token}
```

### Pedidos

```http
# Crear pedido (con lugar de entrega)
POST /api/pedidos
Authorization: Bearer {user-token}
Content-Type: application/json

{
  "productoId": 1,
  "cantidad": 2,
  "notas": "Notas opcionales",
  "lugarEntrega": "Edificio A, Planta 3"
}
```

---

## 📝 Notas Importantes

### Stock:
- El stock se reduce cuando el pedido está en PENDIENTE
- Si cancelas un pedido, el stock NO se devuelve automáticamente
- Admin debe ajustar el stock manualmente si es necesario

### Lugar de Entrega:
- Campo obligatorio
- Sugerencias para la universidad:
  - "Edificio A, Planta 1"
  - "Cafetería Principal"
  - "Biblioteca"
  - "Gimnasio"
  - etc.

### Emails:
- Si no configuras email, funciona igual pero solo imprime en consola
- Configuración de Gmail requiere "App Password"
- Los emails se envían de forma asíncrona (no bloquea la aplicación)

---

## 🔧 Actualizar Base de Datos Existente

Si ya tienes datos en la BD, ejecuta estos scripts:

```sql
-- Agregar columna de stock
ALTER TABLE productos 
ADD COLUMN stock_disponible INTEGER DEFAULT 0;

-- Agregar columna de lugar de entrega
ALTER TABLE pedidos 
ADD COLUMN lugar_entrega VARCHAR(255);

-- Actualizar pedidos existentes (ejemplo)
UPDATE pedidos 
SET lugar_entrega = 'Por definir' 
WHERE lugar_entrega IS NULL;

-- Hacer obligatorio el campo
ALTER TABLE pedidos 
ALTER COLUMN lugar_entrega SET NOT NULL;
```

---

## ✅ Checklist de Implementación

- [x] Stock en productos
- [x] Validación de stock al crear pedido
- [x] Lugar de entrega en pedidos
- [x] Servicio de email
- [x] Notificación al admin (comprobante subido)
- [x] Notificación al usuario (pago confirmado)
- [x] Endpoint para actualizar stock
- [x] Filtrar productos sin stock
- [x] Documentación completa

---

**Última actualización**: 2025-10-30
