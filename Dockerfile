FROM php:7.3-fpm

# Environment Variables
ENV TZ=Asia/Manila
ENV APP_DIR=/var/www/html

RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    mysql-client \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install bcmath pdo_mysql mbstring zip exif pcntl && \
    docker-php-ext-configure gd --with-gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir=/usr/include/ && \
    docker-php-ext-install gd

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# This will allow the container to use a cached version of PHP packages
COPY composer.lock composer.json ${APP_DIR}/

# This is included just to bypass errors thrown by composer scripts
COPY ./database ${APP_DIR}/database

WORKDIR ${APP_DIR}

# Install app dependencies
RUN composer install --no-interaction --no-plugins --no-scripts

# Copy app
COPY . ${APP_DIR}

# Set proper file permissions
RUN chown -R www-data:www-data \
    ${APP_DIR}/storage \
    ${APP_DIR}/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]