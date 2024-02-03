#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -E '^POSTGRES_' .env | xargs)
fi

# Set the container name
CONTAINER_NAME="or_database"

# Set the path for storing backups on the local machine
LOCAL_BACKUP_PATH="./backups"

# Create a timestamp for the backup file
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Use docker exec to run pg_dumpall inside the PostgreSQL container, and compress the backup file with xz
docker exec -t ${CONTAINER_NAME} pg_dumpall -U ${POSTGRES_USER} -w | xz -9e > ./backups/db_backup_${TIMESTAMP}.sql.xz

echo "Backup completed at $(date)"
