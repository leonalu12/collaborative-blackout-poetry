# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.0.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app
EXPOSE 5050

# -------------------------
# Development image (optional for local use)
FROM base AS dev

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
USER node
CMD ["npm", "run", "dev"]

# Test image
FROM node:${NODE_VERSION}-alpine AS test

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --include=de
COPY . .
ENV NODE_ENV=test
CMD ["npm", "test"]

# -------------------------
# Production image
FROM base AS prod
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
USER node
CMD ["node", "src/server.js"]

# -------------------------
