# Estructura del Proyecto UTPlace

## Descripción de Carpetas

```
utplace-market/
│
├── README.md                    # Documentación principal del proyecto
├── .gitignore                   # Archivos a ignorar por Git
│
├── src/                         # Código fuente principal
│   ├── frontend/               # Archivos del frontend
│   │   ├── css/               # Hojas de estilo
│   │   ├── js/                # Scripts JavaScript
│   │   ├── images/            # Imágenes y recursos gráficos
│   │   └── components/        # Componentes HTML reutilizables
│   │
│   └── backend/               # Archivos del backend PHP
│       ├── config/            # Configuraciones (DB, credenciales)
│       ├── controllers/       # Controladores de lógica de negocio
│       ├── models/           # Modelos de datos
│       ├── api/              # Endpoints de API REST
│       └── auth/             # Sistema de autenticación
│
├── database/                   # Scripts de base de datos
│   ├── migrations/            # Scripts de creación/modificación de BD
│   └── seeds/                 # Datos de prueba iniciales
│
├── docs/                      # Documentación técnica
├── tests/                     # Pruebas automatizadas
│
└── uploads/                   # Archivos subidos por usuarios
    ├── products/              # Imágenes de productos
    └── profiles/              # Fotos de perfil
```

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Backend:** PHP 8+
- **Base de Datos:** MySQL 8+
- **Servidor Web:** Apache (XAMPP)
- **Control de Versiones:** Git
- **Infraestructura:** Render (para producción)

## Patrones y Arquitectura

- **MVC (Model-View-Controller)** para organización del código PHP
- **API REST** para comunicación frontend-backend
- **Responsive Design** para compatibilidad móvil
- **Progressive Web App (PWA)** características para mejor UX

## Próximos Pasos

1. Configurar base de datos MySQL
2. Implementar sistema de autenticación con correos UTP
3. Crear estructura de usuarios y perfiles
4. Desarrollar sistema de publicaciones
5. Implementar chat privado entre usuarios
6. Sistema de búsqueda y filtros
7. Panel de administración
8. Testing y deployment
