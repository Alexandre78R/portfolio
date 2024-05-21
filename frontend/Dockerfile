FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN npm install -g npm@10.7.0
RUN npm i -f

COPY src src
COPY public public
# COPY codegen.ts .
COPY next.config.mjs .
COPY tsconfig.json .

CMD npm run dev