FROM node:18-slim

WORKDIR /usr/src/app
COPY app/package*.json ./app/
WORKDIR /usr/src/app/app

# install dependencies
COPY app/ ./
RUN npm ci --production

EXPOSE 8080
CMD ["node", "app.js"]
