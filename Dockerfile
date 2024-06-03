FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add --no-cache git alpine-sdk python3

COPY ./backend/package*.json ./

RUN npm install
RUN npm ci --only=production

COPY . .

EXPOSE 7000

CMD [ "node", "src/index.js" ]
