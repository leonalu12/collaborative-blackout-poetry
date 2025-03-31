# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.0.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app
EXPOSE 3000

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
CMD ["npm", "run", "preview"]

# Test image
FROM base AS test

ENV NODE_ENV=test

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copy the rest of the source code with proper ownership
COPY --chown=node:node . .

# (Optional) Ensure the working directory is writable:
USER root
RUN chmod -R u+w /usr/src/app

USER node
COPY --chown=node:node . .
CMD ["npm", "run", "test"]
