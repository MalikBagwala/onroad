#!/bin/bash

# Pull the latest code
git pull

# Deploy
docker compose up --build -d --remove-orphans && sleep 5 && docker compose restart hasura
