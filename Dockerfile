FROM node:12.2.0

WORKDIR /

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "dist/server.js"]