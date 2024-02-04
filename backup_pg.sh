#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -E '^POSTGRES_' .env | xargs)
fi

ENV=${1:-dev}

# Set the container name
CONTAINER_NAME="or_database"

# Set the path for storing backups on the local machine
LOCAL_BACKUP_PATH="./backups"

# Ensure the backup directory exists
mkdir -p "$LOCAL_BACKUP_PATH"

# Create a timestamp for the backup file
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Use docker exec to run pg_dumpall inside the PostgreSQL container, and compress the backup file with xz
docker exec -t ${CONTAINER_NAME} pg_dumpall -U ${POSTGRES_USER} -w | xz -9e > "$LOCAL_BACKUP_PATH/db_backup_${ENV}_${TIMESTAMP}.sql.xz"

# Change directory to /backups
cd "$LOCAL_BACKUP_PATH"

# Pull the latest changes from the submodule's remote repository
git pull origin main

# Keep the last 6 backup files
ls -t "./db_backup_${ENV}*.sql.xz" | tail -n +7 | xargs rm -f

# Add the backup file to the submodule's git
git add .

# Create a git commit with a message containing the backup file name
git commit -m "chore: backed up db_backup_${ENV}_${TIMESTAMP}.sql.xz"

# Push the backup to the submodule's remote repository
git push origin main

cd ..

# Commit the submodule reference update
git add backups
git commit -m "Sync submodule 'backups' with latest changes" && git push

echo "Backup completed at $(date), only the last six backup files are retained in the repository."