#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Running Backend Integration Tests ---"

# Define Compose file path relative to script location
COMPOSE_FILE="docker-compose.test.yaml"
TESTS_DIR="./back-end/tests"
SEED_IMG_DIR="./back-end/seed-images"
SERVICE_NAME="backend-test"
CONTAINER_TESTS_PATH="/app/tests"
CONTAINER_SEED_IMG_PATH="/app/seed-images"

# Ensure dependencies are running (optional, but good practice)
# docker compose -f "$COMPOSE_FILE" up -d mongo-test minio-test
# sleep 5 # Optional wait

# Run the tests
docker compose -f "$COMPOSE_FILE" run \
  -v "$(pwd)/$TESTS_DIR":"$CONTAINER_TESTS_PATH" \
  -v "$(pwd)/$SEED_IMG_DIR":"$CONTAINER_SEED_IMG_PATH" \
  --rm \
  "$SERVICE_NAME" \
  npm test "$@" # Pass any extra arguments (like test file path) to npm test

echo "--- Backend Integration Tests Finished ---"

# Optional: Automatically bring down dependencies after tests
# echo "--- Bringing down test dependencies ---"
# docker compose -f "$COMPOSE_FILE" down -v