#!/bin/sh
set -e

echo "Starting Laravel application..."

# Create storage directories if they don't exist
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs

# Set permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Wait for database to be ready (with timeout)
echo "Waiting for database connection..."
RETRIES=30
COUNT=0
until php artisan db:show > /dev/null 2>&1; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $RETRIES ]; then
    echo "ERROR: Database connection timeout after $RETRIES attempts"
    echo "DB_HOST: $DB_HOST"
    echo "DB_PORT: $DB_PORT"
    echo "DB_DATABASE: $DB_DATABASE"
    echo "DB_USERNAME: $DB_USERNAME"
    exit 1
  fi
  echo "Database is unavailable - attempt $COUNT/$RETRIES - sleeping 3s..."
  sleep 3
done
echo "Database is ready!"

# Run migrations
php artisan migrate --force --no-interaction

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel application started successfully!"

exec "$@"
