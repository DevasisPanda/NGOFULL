# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests and patches
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Stage 2: Lightweight production runner
FROM node:20-alpine AS runner

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and build output
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
