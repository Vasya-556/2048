FROM node:22-alpine

WORKDIR /2048

COPY package*.json ./
RUN npm ci
COPY . .
RUN npx tsc

EXPOSE 8080

CMD ["npx", "http-server", "-c-1", "-p", "8080"]