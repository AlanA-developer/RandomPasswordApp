FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar archivos
COPY . /var/www/html/

# Instalar dependencias si existe composer.json
RUN cd api && if [ -f "composer.json" ]; then composer install --no-dev --optimize-autoloader; fi

# Dar permisos a la carpeta de storage
RUN mkdir -p /var/www/html/api/storage \
    && chown -R www-data:www-data /var/www/html/api/storage \
    && chmod -R 775 /var/www/html/api/storage

EXPOSE 80
