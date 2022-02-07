FROM node:16

WORKDIR /usr/src/rn-blog-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node","build/server.js"]