#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -E '^DOCKER_' .env | xargs)
fi

# Pull Latest Images
docker compose -f ./production-compose.yml down