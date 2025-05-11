# web-frontend/Dockerfile
# ============ Stage 1: Build ============
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.10.0

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web-frontend/package.json ./web-frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY web-frontend/ ./web-frontend/

# Build application
WORKDIR /app/web-frontend
RUN pnpm run build

# ============ Stage 2: Serve ============
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy nginx configuration
COPY web-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts
COPY --from=builder /app/web-frontend/dist ./

# Expose default HTTP port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
