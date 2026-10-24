FROM node:24-alpine

WORKDIR /app

# shared/ (validators) uses joi from the root package.json
COPY package*.json ./
RUN npm ci

COPY backend/package*.json ./backend/
RUN cd backend && npm ci

COPY shared ./shared
COPY backend ./backend

WORKDIR /app/backend
EXPOSE 4000

CMD ["npx", "tsx", "src/main.ts"]
