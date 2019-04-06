FROM php:7.3-fpm

# Environment Variables
ENV MASTER_TZ=Asia/Manila
ENV MASTER_DIR=/var/www/html

RUN ln -snf /usr/share/zoneinfo/${MASTER_TZ} /etc/localtime && echo ${MASTER_TZ} > /etc/timezone

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
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
COPY composer.lock composer.json ${MASTER_DIR}/

# This is included just to bypass errors thrown by composer scripts
COPY database ${MASTER_DIR}/database

WORKDIR ${MASTER_DIR}

# Install app dependencies
RUN composer install --no-interaction --no-plugins --no-scripts

# Copy app
COPY . ${MASTER_DIR}

EXPOSE 9000
CMD ["php-fpm"]