FROM node:24-alpine

WORKDIR /app

# shared/ (validators) uses joi from the root package.json
COPY package*.json ./
RUN npm ci

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# frontend imports shared/ and enums from backend/src/enums
COPY shared ./shared
COPY backend/src/enums ./backend/src/enums
COPY frontend ./frontend

WORKDIR /app/frontend
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
