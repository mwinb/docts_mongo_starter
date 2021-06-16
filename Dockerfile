FROM node:lts as builder

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src src

RUN npm install --production && npm run build && rm -rf src


FROM node:slim
COPY --from=builder /app /app
WORKDIR /app

EXPOSE 4000

CMD ["node", "dist/server.js"]