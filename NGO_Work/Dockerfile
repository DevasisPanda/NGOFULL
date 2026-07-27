FROM node:20-alpine

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy backend workspace files
COPY ngo-management-system/package.json ngo-management-system/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy backend application code
COPY ngo-management-system/ .

# Build application
RUN pnpm build

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["pnpm", "start"]
