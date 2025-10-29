# CarlotaUm - Backend API

Sistema de venta de comida con gestión de pedidos, pagos por transferencia y reseñas de clientes.

## Tecnologías

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Data JPA**
- **Spring Security + JWT**
- **PostgreSQL**
- **Maven**
- **Lombok**

## Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- PostgreSQL 12+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd backend
```

### 2. Configurar PostgreSQL

Crear la base de datos:

```sql
CREATE DATABASE carlotaum_db;
```

### 3. Configurar application.properties

Editar `src/main/resources/application.properties` con tus credenciales de PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/carlotaum_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

### 4. Instalar dependencias

```bash
mvn clean install
```

### 5. Ejecutar la aplicación

```bash
mvn spring-boot:run
```

O desde tu IDE, ejecutar la clase `CarlotaumApplication.java`

La API estará disponible en: `http://localhost:8080`

## Estructura del Proyecto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/comercio/carlotaum/
│   │   │   ├── config/           # Configuraciones (Security, CORS, Files)
│   │   │   ├── controller/       # Controladores REST
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── entity/           # Entidades JPA
│   │   │   ├── repository/       # Repositorios JPA
│   │   │   ├── security/         # JWT y autenticación
│   │   │   ├── service/          # Lógica de negocio
│   │   │   └── CarlotaumApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── uploads/                      # Carpeta de archivos (se crea automáticamente)
├── pom.xml
├── API_DOCUMENTATION.md          # Documentación completa de la API
└── README.md
```

## Características Principales

### Autenticación y Seguridad
- Registro y login de usuarios
- JWT para autenticación stateless
- Roles de usuario (USER, ADMIN)
- Endpoints protegidos según rol

### Gestión de Productos
- CRUD completo de productos
- Carga de imágenes de productos
- Activación/desactivación de productos

### Gestión de Pedidos
- Creación de pedidos por usuarios
- Sistema de estados de pedido (7 estados)
- Carga de comprobantes de pago
- Validación de pagos por admin
- Historial de pedidos por usuario

### Gestión de Reseñas
- Usuarios pueden crear reseñas con fotos
- Sistema de calificación (1-5 estrellas)
- Moderación de reseñas por admin
- Reseñas públicas para visitantes

### Manejo de Archivos
- Carga de imágenes de productos
- Carga de comprobantes de pago
- Carga de fotos en reseñas
- Límite de 10MB por archivo

## Crear Usuario Administrador

Por defecto, los usuarios se registran con rol `USER`. Para crear un administrador:

1. Registrar un usuario normalmente
2. Ejecutar en PostgreSQL:

```sql
UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'admin@carlotaum.com';
```

## Endpoints Principales

Ver documentación completa en [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Autenticación
- POST `/api/auth/register` - Registrar usuario
- POST `/api/auth/login` - Iniciar sesión

### Productos
- GET `/api/productos` - Listar productos activos
- POST `/api/productos` - Crear producto (Admin)
- POST `/api/productos/{id}/imagen` - Subir imagen (Admin)

### Pedidos
- POST `/api/pedidos` - Crear pedido
- POST `/api/pedidos/{id}/comprobante` - Subir comprobante
- GET `/api/pedidos/mis-pedidos` - Ver mis pedidos
- PUT `/api/pedidos/{id}/estado` - Cambiar estado (Admin)

### Reseñas
- GET `/api/resenas/publicas` - Ver reseñas aprobadas
- POST `/api/resenas` - Crear reseña
- PUT `/api/resenas/{id}/aprobar` - Aprobar reseña (Admin)

## Testing

```bash
mvn test
```

## Build para Producción

```bash
mvn clean package
java -jar target/carlotaum-0.0.1-SNAPSHOT.jar
```

## Variables de Entorno (Producción)

Para producción, configurar estas variables de entorno:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/carlotaum_db
export SPRING_DATASOURCE_USERNAME=usuario
export SPRING_DATASOURCE_PASSWORD=contraseña
export JWT_SECRET=tu-secreto-seguro-de-al-menos-256-bits
export UPLOAD_DIR=/path/to/uploads
```

## Solución de Problemas

### Error de conexión a PostgreSQL
- Verificar que PostgreSQL esté corriendo: `sudo service postgresql status`
- Verificar credenciales en `application.properties`
- Verificar que la base de datos exista

### Error "JwtUtils could not be found"
- Ejecutar `mvn clean install`
- Verificar que las dependencias JWT estén en el pom.xml

### Error de permisos de archivo
- Verificar permisos en la carpeta `uploads/`
- Crear la carpeta manualmente si no existe

## Seguridad

- Las contraseñas se almacenan encriptadas con BCrypt
- Los tokens JWT expiran después de 24 horas
- CORS configurado para desarrollo (localhost:3000, localhost:5173)
- Endpoints sensibles protegidos con roles

## Próximos Pasos

- [ ] Implementar paginación en listados
- [ ] Agregar filtros de búsqueda
- [ ] Notificaciones por email
- [ ] Implementar refresh tokens
- [ ] Métricas y logging avanzado
- [ ] Documentación Swagger/OpenAPI

## Licencia

Este proyecto es propiedad de CarlotaUm.

## Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.
