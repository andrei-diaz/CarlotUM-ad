# 🔄 Estados de Pedido - CarlotaUm (ACTUALIZADO)

## Estados Simplificados

### 5 Estados Finales:

```
1. PENDIENTE
   ↓
   Usuario crea el pedido
   (Stock se reduce aquí)

2. ESPERANDO_VALIDACION
   ↓
   Usuario sube comprobante
   📧 Email a: crispinhithan@gmail.com

3. CONFIRMADO
   ↓
   Admin valida el pago
   📧 Email al usuario
   (Incluye preparación)

4. ENTREGADO
   ↓
   Pedido entregado al cliente
   (Registra fecha_entrega)

5. CANCELADO
   ↓
   Pedido cancelado
```

---

## Tabla de Estados

| Estado | Descripción | Quién lo cambia | Email |
|--------|-------------|-----------------|-------|
| **PENDIENTE** | Pedido creado, esperando pago | Sistema | ❌ No |
| **ESPERANDO_VALIDACION** | Comprobante subido | Usuario | ✅ Al admin |
| **CONFIRMADO** | Pago validado, preparando pedido | Admin | ✅ Al usuario |
| **ENTREGADO** | Pedido entregado | Admin | ❌ No |
| **CANCELADO** | Pedido cancelado | Admin | ❌ No |

---

## Flujo Completo con Emails

### Paso 1: Usuario crea pedido
```http
POST /api/pedidos
{
  "productoId": 1,
  "cantidad": 2,
  "lugarEntrega": "Edificio A",
  "notas": "Sin cebolla"
}
```
✅ Estado: **PENDIENTE**
✅ Stock reducido automáticamente

---

### Paso 2: Usuario sube comprobante
```http
POST /api/pedidos/{id}/comprobante
FormData: comprobante (imagen)
```
✅ Estado cambia a: **ESPERANDO_VALIDACION**

📧 **Email enviado a:** crispinhithan@gmail.com
```
Asunto: 🍽️ Nuevo Pedido #123 - CarlotaUm

¡Nuevo pedido recibido!

📋 Detalles:
Cliente: Juan Pérez
Email: juan@example.com
Teléfono: 555-1234

🍽️ Producto:
Nombre: Carlota Clásica
Cantidad: 2
Total: $50.00

📍 Lugar: Edificio A
💳 Estado: ESPERANDO_VALIDACION
```

---

### Paso 3: Admin valida pago
```http
PUT /api/pedidos/{id}/estado?estado=CONFIRMADO
```
✅ Estado cambia a: **CONFIRMADO**

📧 **Email enviado al usuario:**
```
Asunto: ✅ Pago Confirmado - Pedido #123

¡Hola Juan!

Tu pago ha sido confirmado exitosamente. ✅

📋 Detalles:
Pedido ID: #123
Producto: Carlota Clásica
Cantidad: 2
Total: $50.00
Lugar de entrega: Edificio A

Tu pedido está siendo preparado.
Te avisaremos cuando esté listo.

¡Gracias por tu compra!
CarlotaUm
```

---

### Paso 4: Admin marca como entregado
```http
PUT /api/pedidos/{id}/estado?estado=ENTREGADO
```
✅ Estado final: **ENTREGADO**
✅ Se registra `fecha_entrega` automáticamente

---

## Configuración de Email

### ✅ Configurado en application.properties:

```properties
# Email desde donde se envían las notificaciones
spring.mail.username=anuncarlotaum@gmail.com
spring.mail.password=ectdcbdbicuogryd

# Email del admin que recibe las notificaciones
app.admin.email=crispinhithan@gmail.com
```

### Emails enviados:
- **Desde:** anuncarlotaum@gmail.com
- **Al admin:** crispinhithan@gmail.com (cuando hay nuevo pedido con comprobante)
- **Al usuario:** Su email registrado (cuando el pago es confirmado)

---

## Endpoints de Admin

### Ver pedidos pendientes de validación
```http
GET /api/pedidos/admin/estado/ESPERANDO_VALIDACION
```

### Ver todos los pedidos
```http
GET /api/pedidos/admin/todos
```

### Cambiar estado
```http
PUT /api/pedidos/{id}/estado?estado=CONFIRMADO
PUT /api/pedidos/{id}/estado?estado=ENTREGADO
PUT /api/pedidos/{id}/estado?estado=CANCELADO
```

---

## ⚠️ Notas Importantes

1. **Stock:**
   - Se reduce al crear el pedido (estado PENDIENTE)
   - NO se devuelve automáticamente si se cancela
   - Admin debe ajustar manualmente si es necesario

2. **Emails:**
   - Solo se envían en 2 momentos:
     - Usuario sube comprobante → Email al admin
     - Admin confirma pago → Email al usuario
   - Los emails se envían desde: anuncarlotaum@gmail.com

3. **Lugar de entrega:**
   - Campo obligatorio
   - Se especifica al crear el pedido
   - Ejemplos: "Edificio A", "Cafetería", "Biblioteca", etc.

---

## 🎯 Flujo Resumido

```
Usuario crea pedido (PENDIENTE)
         ↓
Usuario sube comprobante (ESPERANDO_VALIDACION) 📧 Admin
         ↓
Admin valida pago (CONFIRMADO) 📧 Usuario
         ↓
Admin prepara comida
         ↓
Admin entrega (ENTREGADO)
```

---

**Configuración actualizada:** 2025-10-30
**Email notificaciones:** anuncarlotaum@gmail.com → crispinhithan@gmail.com
