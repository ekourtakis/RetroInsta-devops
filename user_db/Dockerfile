FROM mongo:7.0.7

# Copy the init script to the MongoDB initialization directory
COPY init-db.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017