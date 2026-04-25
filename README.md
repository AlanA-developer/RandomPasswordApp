# RandomPassword Generator 🔒

**RandomPassword Generator** es una potente aplicación web de nivel profesional diseñada para la generación masiva de contraseñas seguras y temporales. Con un enfoque en la seguridad criptográfica y la experiencia de usuario, esta herramienta permite a administradores de sistemas y desarrolladores generar hasta 30,000 contraseñas de forma simultánea, aplicando diversas reglas de complejidad y métodos de hashing/encriptación.

---

## 🚀 Características Principales

### 🛠️ Configuración Flexible
- **Generación Masiva:** Permite crear desde 1 hasta 30,000 contraseñas en una sola solicitud.
- **Longitud Personalizable:** Soporta longitudes de contraseña desde 4 hasta 512 caracteres.
- **Tipos de Caracteres:**
  - Solo números.
  - Solo letras.
  - Alfanumérico (Letras + Números).
  - Alfanumérico + Símbolos.

### 🔐 Opciones Avanzadas de Seguridad
- **Exclusión de Caracteres Ambiguos:** Evita confusiones visuales omitiendo caracteres como `0`, `O`, `l`, `1`, e `I`.
- **Cumplimiento Estricto:** Asegura que la contraseña contenga al menos un carácter de cada tipo seleccionado (mayúsculas, minúsculas, números, símbolos).

### 🛡️ Métodos de Encriptación y Hashing
La aplicación no solo genera las contraseñas, sino que también proporciona su representación segura utilizando los siguientes métodos:
- **SHA-256:** Estándar de hashing seguro recomendado.
- **MD5:** Hashing rápido de 128 bits.
- **AES-256-CBC:** Cifrado reversible (requiere una clave secreta).
- **Bcrypt:** Algoritmo adaptativo ideal para contraseñas.
- **Argon2id:** Ganador de la Password Hashing Competition.

### 📊 Gestión y Exportación
- **Paginación Integrada:** Visualización fluida de grandes volúmenes de datos directamente en el navegador.
- **Filtro en Tiempo Real:** Búsqueda instantánea dentro de los resultados generados.
- **Exportación a Excel:** Descarga un reporte detallado en formato `.xlsx` con el listado completo de contraseñas planas y hasheadas.

---

## 🛠️ Arquitectura y Tecnologías

El proyecto está dividido en dos capas principales:

### Frontend (SPA)
- **HTML5 Semántico** y accesibilidad mejorada.
- **CSS3 Moderno:** Diseño premium con efectos *Glassmorphism*, variables CSS y total adaptabilidad (Responsive Design).
- **Vanilla JavaScript (ES6+):** Arquitectura basada en módulos, sin dependencias externas pesadas.

### Backend (API)
- **PHP 7.4+** para el procesamiento lógico.
- **Composer:** Gestión de dependencias del servidor.
- **PhpSpreadsheet:** Biblioteca robusta para la generación de archivos Excel.
- **Seguridad:** Implementación de *Rate Limiting* basado en IP para prevenir abusos.

---

## 📂 Estructura del Proyecto

```
RandomPasswordApp/
├── api/                        # Backend de la aplicación
│   ├── src/                    # Lógica central en PHP
│   │   ├── Encryptor.php       # Manejo de hashing y cifrado
│   │   ├── ExcelExporter.php   # Generación de reportes Excel
│   │   └── PasswordGenerator.php # Algoritmo de generación segura
│   ├── storage/                # Almacenamiento temporal (Límites de peticiones)
│   ├── tests/                  # Pruebas unitarias
│   ├── index.php               # Punto de entrada de la API
│   ├── composer.json           # Dependencias de PHP
│   └── phpunit.xml             # Configuración de pruebas
├── assets/                     # Recursos estáticos
│   ├── js/                     # Módulos de JavaScript
│   └── style.css               # Estilos globales
├── index.html                  # Interfaz de usuario principal
└── README.md                   # Documentación del sistema
```

---

## ⚙️ Requisitos e Instalación

### Requisitos Previos
- Servidor Web (Apache/Nginx) con soporte para **PHP 7.4 o superior**.
- **Composer** instalado globalmente.

### Pasos para la Instalación

1. **Clonar o copiar el repositorio** en el directorio raíz de tu servidor (ej. `c:\wamp64\www\RandomPasswordApp`).
2. **Instalar dependencias del Backend:**
   Navega a la carpeta `api/` y ejecuta:
   ```bash
   composer install
   ```
3. **Configurar permisos:**
   Asegúrate de que la carpeta `api/storage/` tenga permisos de escritura para que el sistema de *Rate Limiting* funcione correctamente.

---

## 🧪 Pruebas Unitarias

El proyecto cuenta con pruebas automatizadas para validar la lógica de generación y cifrado. Para ejecutarlas:

1. Accede al directorio `api/`.
2. Ejecuta el archivo PHPUnit incluido:
   ```bash
   php phpunit.phar
   ```

---

## 🛡️ Seguridad y Consideraciones

- **Criptografía Segura:** Las contraseñas se generan utilizando la función `random_bytes()` de PHP, garantizando aleatoriedad criptográficamente segura.
- **Límites de Uso:** El sistema implementa un bloqueo temporal si se detectan más de 45 peticiones por minuto desde una misma dirección IP.

---

## ✒️ Autor

- **Alan A. (Draizce)** — [GitHub](https://github.com/AlanA-developer)

---
*Desarrollado con fines de administración ágil y segura de credenciales.*
