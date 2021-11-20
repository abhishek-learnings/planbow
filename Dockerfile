FROM node:9.6.1
WORKDIR /usr/src/app
ADD . .
ADD package.json package.json
RUN npm install
RUN npm install --unsafe-perm
RUN npm run build
WORKDIR /usr/src/app/dist
WORKDIR /usr/src/app
cmd  ["node", "dist/server.js"]