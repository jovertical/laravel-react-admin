#!/usr/bin/env bash

if [ "$PHP_ENV" != "development" ]; then
    chown -R www-data /var/www/html
fi