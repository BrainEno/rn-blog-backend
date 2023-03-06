FROM node:16

RUN mkdir /app
WORKDIR /app

COPY package*.json /app
COPY .env /app

RUN node -v
RUN npm install

COPY . .

EXPOSE 8080

CMD ["node","build/server.js"]