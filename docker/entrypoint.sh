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

# IMPORTANT: Clear all Laravel caches first
echo "Clearing Laravel caches..."
rm -rf bootstrap/cache/*.php
php artisan config:clear || true
php artisan cache:clear || true

# Wait for database to be ready (with timeout)
echo "Waiting for database connection..."
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_DATABASE: $DB_DATABASE"
echo "DB_USERNAME: $DB_USERNAME"
echo "DB_PASSWORD length: ${#DB_PASSWORD}"

# Show PHP MySQL extension
echo "Checking PHP MySQL extensions..."
php -m | grep -i mysql || echo "WARNING: MySQL extensions not found!"

# Test with actual error output
echo "Testing database connection with detailed error..."
php artisan db:show 2>&1 || echo "Initial connection failed (expected)"

# Wait for database
RETRIES=10
COUNT=0
until php artisan db:show 2>&1; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $RETRIES ]; then
    echo "ERROR: Database connection failed after $RETRIES attempts"
    echo "Last error output:"
    php artisan migrate --force --no-interaction 2>&1 || true
    echo "--- Attempting manual MySQL connection test ---"
    php -r "try { new PDO('mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD'); echo 'PDO connection SUCCESS\n'; } catch (Exception \$e) { echo 'PDO Error: ' . \$e->getMessage() . '\n'; }" || true
    exit 1
  fi
  echo "Database unavailable - attempt $COUNT/$RETRIES..."
  sleep 3
done
echo "Database is ready!"

# Run migrations
php artisan migrate --force --no-interaction

# Seed database if empty (check if users table is empty)
USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null || echo "0")
if [ "$USER_COUNT" = "0" ]; then
  echo "Database is empty, running seeders..."
  php artisan db:seed --force --no-interaction
else
  echo "Database already has users, skipping seeding."
fi

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel application started successfully!"

exec "$@"
