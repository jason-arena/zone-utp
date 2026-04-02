# Configuración de Desarrollo UTPlace

## Requisitos del Sistema

- **PHP:** 8.0 o superior
- **MySQL:** 8.0 o superior  
- **Apache:** 2.4 o superior
- **XAMPP:** Recomendado para desarrollo local

## Configuración Local

1. **Instalar XAMPP**
   - Descargar desde [apachefriends.org](https://www.apachefriends.org/)
   - Instalar con PHP 8+ y MySQL

2. **Configurar Base de Datos**
   ```sql
   CREATE DATABASE utplace_market;
   CREATE USER 'utplace_user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON utplace_market.* TO 'utplace_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Configurar Virtual Host (Opcional)**
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/xampp/htdocs/utplace-market/utplace-market"
       ServerName utplace.local
   </VirtualHost>
   ```

4. **Variables de Entorno**
   - Crear archivo `.env` basado en `.env.example`
   - Configurar credenciales de base de datos
   - Configurar SMTP para correos UTP

## URLs de Desarrollo

- **Frontend:** http://localhost/utplace-market/utplace-market/
- **API:** http://localhost/utplace-market/utplace-market/src/backend/api/
- **phpMyAdmin:** http://localhost/phpmyadmin/

## Comandos Útiles

```bash
# Iniciar XAMPP
sudo /opt/lampp/start

# Detener XAMPP  
sudo /opt/lampp/stop

# Ver logs de Apache
tail -f /opt/lampp/logs/error_log

# Ver logs de MySQL
tail -f /opt/lampp/logs/mysql_error.log
```

## Estructura de Deployment

- **Desarrollo:** XAMPP local
- **Staging:** Servidor de pruebas
- **Producción:** Render con MySQL en la nube
