FROM node:20.9.0-alpine3.18

RUN apk update && apk add --no-cache make g++ python3 ghostscript graphicsmagick ghostscript-fonts

WORKDIR /worker
COPY . /worker

RUN npm install

CMD node index.mjs
