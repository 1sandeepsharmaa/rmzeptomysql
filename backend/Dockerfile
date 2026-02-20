# ─────────────────────────────────────
# Backend Dockerfile
# Node.js 18 LTS (alpine = lightweight)
# ─────────────────────────────────────
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Create uploads directory (will be overridden by Docker volume)
RUN mkdir -p uploads

# Expose the API port
EXPOSE 3000

# Start the server (uses node directly in production; nodemon only for dev)
CMD ["node", "index.js"]
