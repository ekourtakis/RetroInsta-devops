#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo 'Waiting for MinIO service (http://minio:9000)...'

# Loop until mc alias can be set successfully
# Using --quiet suppresses success messages, only shows errors
until mc alias set myminio http://minio:9000 minioadmin minioadmin --api S3v4 --quiet; do
  echo '... MinIO not ready, waiting 5s ...'
  sleep 5
done

# Now that alias is set, proceed with check/create
echo 'MinIO ready! Checking for bucket: posts'

# Check if bucket exists. Use mc stat as an alternative reliable check.
# mc stat returns non-zero if the target doesn't exist.
if mc stat myminio/posts > /dev/null 2>&1; then
  echo 'Bucket posts already exists.'
else
  echo 'Bucket posts does not exist. Creating bucket...'
  mc mb myminio/posts
  echo 'Bucket posts created.'
fi

# Set the bucket to public
echo 'Configuring bucket posts to be public...'
mc anonymous set public myminio/posts
echo 'Bucket posts is now public.'

exit 0