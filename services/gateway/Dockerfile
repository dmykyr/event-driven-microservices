FROM node:18-alpine

ARG PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
COPY .env .env

RUN npm run build

RUN apk add --no-cache curl

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

CMD ["npm", "run", "start:prod"]