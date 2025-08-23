FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY common/ ./common/
COPY services/tiktok-collector/package*.json ./services/tiktok-collector/

RUN npm ci

WORKDIR /app/common/database
RUN npx prisma generate

WORKDIR /app/common/types
RUN npm run build

WORKDIR /app
COPY services/tiktok-collector/ ./services/tiktok-collector/

WORKDIR /app/services/tiktok-collector

COPY services/tiktok-collector/.env .env

RUN npm run build

RUN apk add --no-cache curl

CMD ["npm", "run", "start:prod"]