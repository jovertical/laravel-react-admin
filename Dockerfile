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

# Add group & user
RUN groupadd -g 1000 www && useradd -u 1000 -ms /bin/bash -g www www

WORKDIR ${APP_DIR}

# Copy app
COPY . ${APP_DIR}

# Install app dependencies
RUN composer install --no-interaction --no-plugins --no-scripts

# Copy app permissions
COPY --chown=www:www . ${APP_DIR}

USER www

EXPOSE 9000
CMD ["php-fpm"]