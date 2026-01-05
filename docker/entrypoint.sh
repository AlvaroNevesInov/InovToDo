#!/bin/sh
set -e

echo "Starting Laravel application..."

# Create storage directories if they don't exist
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/database

# Create SQLite database file if it doesn't exist
touch /var/www/html/database/database.sqlite

# Set permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/database
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache
chmod 664 /var/www/html/database/database.sqlite

# Run migrations
php artisan migrate --force --no-interaction

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel application started successfully!"

exec "$@"
