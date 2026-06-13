# Catálogo de Productos - Frontend (Angular)

Este es el frontend del reto técnico para la gestión de productos. Está desarrollado en Angular con un enfoque 100% funcional y desacoplado, utilizando Signals para el manejo de estado y Reactive Forms para las validaciones en cliente.

La aplicación incluye:
* **Catálogo Público:** Vista libre para usuarios anónimos con loaders y manejo de errores de conexión.
* **Consola de Administración:** CRUD de productos exclusivo para usuarios con rol de Administrador.
* **Seguridad y Trazabilidad:** Guard de rutas, interceptor para inyectar automáticamente el JWT y propagación global de la cabecera `X-Correlation-ID`.

## 📦 Despliegue Completo

Para levantar toda la infraestructura contenerizada (este Frontend + la API en Spring Boot + MySQL), por favor visita el repositorio principal donde se encuentra el orquestador de Docker Compose:

🔗 **[Repositorio Principal - Docker Compose](https://github.com)**

---

## 🛠️ Desarrollo Local

Si solo quieres correr este frontend de forma independiente:

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Levanta el servidor local:
   ```bash
   npm start
   ```

La aplicación se abrirá en `http://localhost:4200` y apuntará por defecto al puerto del backend configurado en los `environments` (`http://localhost:8080`).
