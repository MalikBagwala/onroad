#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -E '^DOCKER_|^GITLAB_' .env | xargs)
fi

# Login
docker login -u $GITLAB_TOKEN_USERNAME -p $GITLAB_TOKEN_PASSWORD registry.gitlab.com/malikbagwala

# Pull Latest Images
docker compose -f ./production-compose.yml pull

# Deploy only database
# docker compose -f ./production-compose.yml --env-file ./.env up -d --remove-orphans db

# Deploy
docker compose -f ./production-compose.yml --env-file ./.env up -d --remove-orphans && sleep 5 && docker compose -f ./production-compose.yml restart hasura
