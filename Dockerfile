FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN apk add chromium

USER node

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]