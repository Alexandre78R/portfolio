FROM node:16-alpine3.14

RUN apk --no-cache add \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    librsvg-dev \
    python3

RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN npm i 

COPY src src
COPY codegen.ts .

COPY tsconfig.json .


CMD npm run start