#!/bin/sh
set -e

# 1. Run migrations and seeders
php artisan migrate --force
#php artisan db:seed --class=AdminSeeder --force

# 2. Run the webdevops entrypoint to set up Nginx/PHP, then start Supervisord
exec /entrypoint supervisord