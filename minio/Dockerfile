FROM quay.io/minio/minio:latest

# Define environment variables (optional - can be moved to docker-compose)
ENV MINIO_ROOT_USER RetroInstaRootUser
ENV MINIO_ROOT_PASSWORD V7t#rP@zB9w!qQ2y$6E

# Define the entry point for the container
ENTRYPOINT ["/usr/bin/minio"]

# Set the command to start the MinIO server
CMD ["server", "/data", "--console-address", ":9001"]