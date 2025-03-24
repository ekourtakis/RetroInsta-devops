# Sets up Node.js as the base image
FROM node:12.18.1
 
# Set the working directory
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package.json package.json
COPY package-lock.json package-lock.json
 
# Install dependencies
RUN npm install
 
# Copy remaining app's source code into image
COPY . .
 
# Run server.js when image in container
CMD [ "node", "server.js" ]
