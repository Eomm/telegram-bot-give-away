#!/bin/bash

# Check if container is running
if docker ps --filter "name=give-away-postgres" --format "{{.Names}}" | grep -q "give-away-postgres"; then
    echo "Stopping container..."
    docker stop give-away-postgres
else
    echo "Container is not running."
fi
