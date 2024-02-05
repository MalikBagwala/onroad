#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -E '^POSTGRES_|^AWS_' .env | xargs)
fi

ENV=${1:-dev}

# Set the container name
CONTAINER_NAME="or_database"

# Create a timestamp for the backup file
TIMESTAMP=$(date +"%s")

# Use docker exec to run pg_dumpall inside the PostgreSQL container, and compress the backup file with xz
docker exec -t ${CONTAINER_NAME} pg_dumpall -U ${POSTGRES_USER} -w \
  | gzip \
  | aws s3 cp - s3://backups.onroad.one/${ENV}/postgres-${TIMESTAMP}.sql.gz \
    --region ap-south-1 \
    --acl private