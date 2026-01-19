FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --legacy-peer-deps

COPY src src
COPY public public
COPY next.config.mjs .
COPY tsconfig.json .
COPY jest.config.ts .
COPY __test__ __test__

ARG NEXT_PUBLIC_API_TOKEN
ENV NEXT_PUBLIC_API_TOKEN=${NEXT_PUBLIC_API_TOKEN}

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ARG NEXT_PUBLIC_JWT_SECRET
ENV NEXT_PUBLIC_JWT_SECRET=${NEXT_PUBLIC_JWT_SECRET}

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

# Enable Turbopack and hot reload
ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBOPACK_RESULT_STREAMING=true

EXPOSE 3000

# Switch between dev and prod without editing the Dockerfile
CMD ["/bin/sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run build && npm run start; else npm run dev; fi"]