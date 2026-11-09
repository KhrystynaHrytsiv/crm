# ---- build ----
FROM node:24-alpine AS build
WORKDIR /app

# shared/ (validators, logger) uses joi/pino from the root package.json
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# frontend imports shared/ and enums from backend/src/enums
COPY shared ./shared
COPY backend/src/enums ./backend/src/enums
COPY frontend ./frontend

# NEXT_PUBLIC_* values are inlined into the browser bundle at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd frontend && npm run build

# ---- runtime: standalone server only ----
FROM node:24-alpine
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=build --chown=node:node /app/frontend/.next/standalone ./
COPY --from=build --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=build --chown=node:node /app/frontend/public ./frontend/public

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:3000/login" >/dev/null || exit 1

CMD ["node", "frontend/server.js"]
