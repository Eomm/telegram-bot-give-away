#!/bin/bash

# Check if container is already running
if docker ps --filter "name=give-away-postgres" --format "{{.Names}}" | grep -q "give-away-postgres"; then
    echo "Container is already running."
else
    # Run the Docker command
    docker run --rm -p 5432:5432 --name give-away-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=telegramBotGiveAway -d postgres:15-alpine
fi
