FROM node:21-alpine3.18

RUN apk add --no-cache git

WORKDIR /app

COPY graph-app ./
RUN npm install

EXPOSE 3000

# Uncomment for production
#CMD ["node", "server.js"]
