FROM node:18-alpine

WORKDIR /nodejs

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

CMD ["npm", "start"]
