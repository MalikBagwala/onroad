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

# Change directory to /backups
cd ./backups && git pull

# Remove older .sql.xz files
ls -t ./*.sql.xz | tail -n +4 | xargs rm -f

# Add the backup file to git
git add .

# Create a git commit with a message containing the backup file name
git commit -m "chore: backed up db_backup_${TIMESTAMP}.sql.xz"

# Push the backup to the remote repository
git push

cd ..
git add .

# Commit and push the removal of older files
git commit -m "Sync submodule 'backups' with latest changes" && git push

echo "Backup completed at $(date), only the last three backup files are retained in the repository."