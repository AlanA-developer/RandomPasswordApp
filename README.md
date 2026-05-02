# RandomPasswordApp v2.0 (SaaS Edition) 🚀

**RandomPasswordApp** es una potente aplicación web de nivel profesional (SaaS-ready) diseñada para la generación masiva de contraseñas seguras y temporales. Con un enfoque absoluto en la seguridad criptográfica, privacidad (Zero-Knowledge) y la mejor experiencia de usuario. Esta herramienta permite a administradores de sistemas y desarrolladores generar hasta 30,000 contraseñas de forma simultánea.

---

## 🚀 Características Principales

### 🛠️ Configuración Flexible
- **Generación Masiva:** Permite crear desde 1 hasta 30,000 contraseñas en una sola solicitud.
- **Passphrases (Diceware):** Generación de contraseñas memorables estilo frase, tanto en el servidor como localmente.
- **Símbolos Personalizados:** Control total sobre qué caracteres especiales están permitidos.
- **Tipos Clásicos:** Alfanumérico, solo letras, solo números, y alfanumérico + símbolos.

### 🔐 Privacidad y Seguridad Extrema
- **Generación Zero-Knowledge:** Una opción de ejecución en el lado del cliente (Navegador) usando `window.crypto.getRandomValues`. Ninguna contraseña viaja a través de la red; privacidad 100% garantizada.
- **API Keys Estáticas:** El backend está protegido mediante el requerimiento de una cabecera HTTP `X-API-KEY`, evitando abusos en despliegues expuestos a internet.
- **Zxcvbn (Entropía en Tiempo Real):** Se calcula visualmente la "Fuerza" y el "Tiempo estimado de Crackeo" de cada contraseña individual en la tabla de resultados.

### 🛡️ Métodos de Encriptación y Hashing
Si decides enviar las contraseñas al servidor, estas regresan con representaciones seguras:
- **SHA-256, MD5**
- **AES-256-CBC:** Cifrado reversible (requiere una clave secreta).
- **Bcrypt & Argon2id:** Ideales para almacenar hashes en bases de datos.

### 📊 Gestión, UI y Exportación
- **Descargas Locales y Rápidas:** Descarga tus lotes de contraseñas en formato `.xlsx` (vía PHP), o en `JSON` y `.env` de forma ultra rápida y local.
- **Generador de QR Integrado:** Escanea contraseñas específicas de forma fácil y segura hacia tu smartphone mediante una ventana modal con códigos QR.
- **Temas Dinámicos:** Soporte nativo para *Modo Oscuro (Glassmorphism)* y *Modo Claro*, recordando tu preferencia.

---

## 🛠️ Arquitectura y Tecnologías

### Frontend (SPA)
- **CSS3 Moderno:** Variables CSS, Glassmorphism y temas Claro/Oscuro.
- **Vanilla JS (ES6+):** Arquitectura modular (`utils.js`, `main.js`, `api.js`, `wordlist.js`).
- **Integraciones CDN:** `qrcode.js` para los códigos y `zxcvbn.js` para entropía.

### Backend (API)
- **PHP 8.3:** Alto rendimiento y tipado estricto.
- **Composer:** `phpoffice/phpspreadsheet` para Excels.
- **Seguridad:** Rate Limiting por IP + Validación por Token (API Key).

---

## 🐳 Despliegue con Docker (Recomendado)

La aplicación está completamente "Dockerizada" y lista para producción.

1. **Clona el repositorio** e ingresa al directorio.
2. Levanta los servicios con Docker Compose:
   ```bash
   docker compose up --build -d
   ```
3. Visita `http://localhost/` o el puerto que hayas configurado. El entorno correrá bajo Apache/PHP 8.3 de manera aislada.
4. *Nota:* Por defecto la API Key es `master_key_12345`. Puedes modificarla en el archivo `docker-compose.yml` en la sección `environment: API_KEY`.

---

## ⚙️ Instalación Tradicional (XAMPP/WAMP)

1. Mueve el proyecto a tu carpeta `htdocs` o `www`.
2. Asegúrate de tener **PHP 8.3** (recomendado para compatibilidad de dependencias) y **Composer**.
3. Navega a `api/` y ejecuta:
   ```bash
   composer install
   ```
4. Define tu variable de entorno `API_KEY` (o modifica `$expectedApiKey` en `api/index.php`).

---

## ✒️ Autor
- **Alan A. (Draizce)** — [GitHub](https://github.com/AlanA-developer)

---
*Desarrollado con fines de administración ágil y segura de credenciales.*
