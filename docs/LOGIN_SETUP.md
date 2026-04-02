# Guía de Configuración - UTPlace

## Configuración del Entorno Local

### Prerrequisitos
- XAMPP (Apache, MySQL, PHP 8+)
- Navegador web moderno
- Editor de código (VS Code recomendado)

### Instalación y Configuración

1. **Clonar o descargar el proyecto**
   ```bash
   git clone https://github.com/JasonPTY/utplace-market.git
   ```

2. **Mover a XAMPP**
   - Copiar la carpeta del proyecto a `C:\xampp\htdocs\`
   - La ruta final debe ser: `C:\xampp\htdocs\utplace-market\utplace-market\`

3. **Configurar base de datos**
   - Iniciar XAMPP (Apache y MySQL)
   - Abrir phpMyAdmin: `http://localhost/phpmyadmin`
   - Crear base de datos `utplace_market`
   - Importar el archivo `database/migrations/initial_setup.sql`

4. **Configurar variables de entorno**
   - Copiar `.env.example` como `.env`
   - Configurar credenciales de base de datos
   - Ajustar configuración de correo UTP

5. **Acceder a la aplicación**
   - URL: `http://localhost/utplace-market/utplace-market/`

## Estructura de Login

### Archivos principales:
- `index.html` - Página principal de login
- `src/frontend/css/login.css` - Estilos del login
- `src/frontend/js/login.js` - Funcionalidad JavaScript
- `src/frontend/css/accessibility.css` - Mejoras de accesibilidad

### Características implementadas:
✅ Validación de correo institucional @utp.ac.pa
✅ Diseño responsivo (móvil, tablet, desktop)
✅ Accesibilidad completa (WCAG 2.1)
✅ Animaciones suaves y profesionales
✅ Toggle de mostrar/ocultar contraseña
✅ Validación en tiempo real
✅ Manejo de errores intuitivo
✅ Loading states
✅ Recordar usuario
✅ Olvidé mi contraseña
✅ Login con Google (preparado)

### Paleta de colores UTP:
- Primary Purple: `#6B46C1`
- Purple Dark: `#553C9A` 
- Purple Light: `#8B5CF6`
- Accent Purple: `#A855F7`
- Background: `#FAFBFC`
- White: `#FFFFFF`

## Próximos pasos

1. **Backend PHP**
   - Crear endpoints de autenticación
   - Configurar sesiones y JWT
   - Validación server-side

2. **Base de datos**
   - Diseñar esquema de usuarios
   - Tablas de productos y categorías
   - Sistema de mensajes

3. **Dashboard**
   - Página principal post-login
   - Navegación y layout base

## Comandos útiles

```bash
# Iniciar XAMPP
sudo /opt/lampp/xampp start

# Ver logs de Apache
tail -f /opt/lampp/logs/error_log

# Reiniciar servicios
sudo /opt/lampp/xampp restart
```

## Notas de desarrollo

- El login está optimizado para correos @utp.ac.pa únicamente
- Todas las validaciones son tanto client-side como server-side
- El diseño sigue las mejores prácticas de UX/UI
- Código documentado y mantenible
- Preparado para PWA en futuras versiones
