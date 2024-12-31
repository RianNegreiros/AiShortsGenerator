FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app ./

RUN npm ci --omit-dev

EXPOSE 3000

CMD ["npm", "start"]