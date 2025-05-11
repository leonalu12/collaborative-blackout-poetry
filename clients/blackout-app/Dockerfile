# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.0.0

####################################
# 1) Base: install deps & copy code
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

# install all (dev+prod) deps
COPY package*.json ./
RUN npm ci

# bring in your source
COPY . .

# let the 'node' user write timestamp/cache files
RUN chown -R node:node /usr/src/app

####################################
# 2) Dev image: Vite server for local dev
FROM base AS dev
USER node
EXPOSE 5173
CMD ["npm", "run", "dev"]

####################################
# 3) Test image: for CI/CD (Jest)
FROM base AS test
ENV NODE_ENV=test
USER node
CMD ["npm", "run", "test"]

####################################
# 4) Build stage: compile optimized assets
FROM base AS build
# drop dev deps if you like:
# RUN npm ci --omit=dev
RUN npm run build

####################################
# 5) Prod: serve with NGINX
FROM nginx:alpine AS prod
# clean default content
RUN rm -rf /usr/share/nginx/html/*

# copy your built app
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]