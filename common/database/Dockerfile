FROM node:18-alpine

WORKDIR /app/database

COPY package*.json ./
COPY prisma/ ./prisma/

RUN npm ci
RUN npx prisma generate

CMD ["npx", "prisma", "migrate", "deploy"]