# ---- build: type-check and bundle src + shared into dist/main.js ----
FROM node:24-alpine AS build
WORKDIR /app

# shared/ is type-checked together with the backend and needs joi/pino types from the root
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY backend/package*.json ./backend/
RUN cd backend && npm ci

COPY shared ./shared
COPY backend ./backend
RUN cd backend && npm run build

# ---- runtime: production dependencies + bundle only ----
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/backend/dist ./dist

USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${PORT:-4000}/health" || exit 1

CMD ["node", "--enable-source-maps", "dist/main.js"]
