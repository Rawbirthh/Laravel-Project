# Stage 1: Build frontend assets (Node.js)
FROM node:20 AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: PHP application
FROM webdevops/php-nginx:8.3

ENV WEB_DOCUMENT_ROOT=/app/public
ENV APP_ENV=production

# Make render use port 80
EXPOSE 80

WORKDIR /app

# Copy all files
COPY . .

# Copy built assets from Stage 1
COPY --from=frontend /app/public/build /app/public/build

# Install PHP dependencies and set permissions
RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && mkdir -p storage/framework/views storage/framework/sessions storage/framework/cache \
    && chown -R application:application /app \
    && chmod -R 775 storage bootstrap/cache

# Copy and enable the start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Run the start script
CMD ["/start.sh"]