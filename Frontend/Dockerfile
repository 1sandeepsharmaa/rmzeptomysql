# ─────────────────────────────────────────────
# Frontend Dockerfile  (React + Vite)
# Stage 1: Build  →  Stage 2: Serve via nginx
# ─────────────────────────────────────────────

# ── Stage 1: Build ──────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite builds into /app/dist
RUN npm run build

# ── Stage 2: Serve with nginx ────────────────
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
