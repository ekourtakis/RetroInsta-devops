# ---- Builder Stage ----
# Build the TypeScript code
FROM node:slim AS builder
WORKDIR /app

# Copy package files and install ALL dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm ci

# Copy tsconfig and source code
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript code
RUN npm run build
# At this point, the compiled JS is in the /app/dist directory

# ---- Production Stage ----
# Create the final, smaller image
FROM node:slim
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy the compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 7005

# Command to run the compiled application
CMD ["node", "dist/server.js"]