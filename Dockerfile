# Host-agnostic container: any Docker host can run `node server.js`.
# No hosting provider is fixed here.

FROM node:20-alpine AS deps
# Not /app: Next.js standalone treats WORKDIR /app as a route for the index request `/`.
WORKDIR /web
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /web
ENV NEXT_TELEMETRY_DISABLED=1
# JAVA_API_BASE_URL is inlined into the browser bundle at build time.
ARG JAVA_API_BASE_URL=""
ENV JAVA_API_BASE_URL=$JAVA_API_BASE_URL
COPY --from=deps /web/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /web
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /web/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
