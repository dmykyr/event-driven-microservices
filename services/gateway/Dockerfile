FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY common/types ./common/types
COPY common/logger ./common/logger
COPY services/gateway/package*.json ./services/gateway/

RUN npm ci

WORKDIR /app/common/types
RUN npm run build

WORKDIR /app/common/logger
RUN npm run build

WORKDIR /app
COPY services/gateway/ ./services/gateway/

WORKDIR /app/services/gateway

COPY services/gateway/.env .env

RUN npm run build

RUN apk add --no-cache curl

CMD ["npm", "run", "start:prod"]