FROM node:slim
RUN npm install -g pnpm@10

# Set the WORKDIR to the monorepo root
WORKDIR /app

# Copy root configs & workspace definition
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./turbo.json* ./

# Copy ALL package.json files for the entire workspace
COPY ./shared-types/package.json ./packages/shared-types/package.json
COPY ./front-end/package.json ./front-end/package.json
COPY ./back-end/package.json ./back-end/package.json

# Install ALL workspace dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy ALL source code for packages needed by the frontend dev server
COPY ./shared-types ./packages/shared-types
COPY ./front-end ./front-end

# Set the final WORKDIR to the frontend package directory
WORKDIR /app/front-end

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host"]