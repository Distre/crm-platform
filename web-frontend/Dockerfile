# web-frontend/Dockerfile
# ============ Stage 1: Build ============
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Build application
COPY . .
RUN pnpm run build

# ============ Stage 2: Serve ============
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build artifacts
COPY --from=builder /app/dist ./

# Expose default HTTP port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
