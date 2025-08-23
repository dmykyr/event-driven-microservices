FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY common/ ./common/
COPY services/reporter/package*.json ./services/reporter/

RUN npm ci

WORKDIR /app/common/database
RUN npx prisma generate

WORKDIR /app/common/types
RUN npm run build

WORKDIR /app
COPY services/reporter/ ./services/reporter/

WORKDIR /app/services/reporter

COPY services/reporter/.env .env

RUN npm run build

RUN apk add --no-cache curl

CMD ["npm", "run", "start:prod"]