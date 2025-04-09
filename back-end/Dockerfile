FROM node:slim
RUN npm install -g pnpm@10

# Set the WORKDIR to the monorepo root
WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./turbo.json* ./
# Copy ALL package.json files for the entire workspace
# Needed for pnpm install to resolve the full workspace
COPY ./shared-types/package.json ./packages/shared-types/package.json
COPY ./front-end/package.json ./front-end/package.json
COPY ./back-end/package.json ./back-end/package.json

# Install ALL workspace dependencies (including devDependencies)
# This installs everything needed for 'tsx', 'typescript', etc.
RUN pnpm install --frozen-lockfile

# Copy ALL source code for packages needed by the backend dev server
# Includes shared-types and backend source itself
COPY ./shared-types ./packages/shared-types
COPY ./back-end ./back-end

# Set the final WORKDIR to the backend package directory
WORKDIR /app/back-end

EXPOSE 3001

CMD ["pnpm", "run", "dev"]