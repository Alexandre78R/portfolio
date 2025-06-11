FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN npm i

COPY src src
COPY public public
# COPY codegen.ts .
COPY next.config.mjs .
COPY tsconfig.json .

ARG NEXT_PUBLIC_API_TOKEN
ENV NEXT_PUBLIC_API_TOKEN=${NEXT_PUBLIC_API_TOKEN}

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# CMD npm run dev

RUN npm run build
CMD npm run start

# RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi
# CMD if [ "$NODE_ENV" = "production" ]; then npm run start; else npm run dev; fi