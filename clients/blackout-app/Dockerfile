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

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

USER node
COPY --chown=node:node . .

USER root
RUN chmod -R u+w /usr/src/app

USER root
RUN --mount=type=cache,target=/root/.npm \
    npm run build
RUN --mount=type=cache,target=/root/.npm \
    npm run lint
RUN --mount=type=cache,target=/root/.npm \
    npm run test
# RUN --mount=type=cache,target=/root/.npm \
#     npm run test:integration
# RUN --mount=type=cache,target=/root/.npm \
# RUN npm run test