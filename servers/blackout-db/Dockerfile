# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.0.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app
EXPOSE 5000

# Development image
FROM base AS dev

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

USER node
COPY --chown=node:node . .
CMD ["npm", "run", "dev"]

# Production image
FROM base AS prod

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

USER node
COPY --chown=node:node . .
CMD ["node", "src/server.js"]


FROM node:20-alpine AS test

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --include=dev

COPY . .
ENV NODE_ENV=test
CMD ["npm", "test"]