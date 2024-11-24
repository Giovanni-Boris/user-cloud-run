FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src src/

USER root
RUN apk add --no-cache libc6-compat jq
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
RUN pnpm install
# Remove the prepare script from package.json
RUN jq 'del(.scripts.prepare)' package.json > temp.json && mv temp.json package.json
RUN npx nest build && pnpm prune --prod

USER node

FROM node:20-alpine

USER node

ENV LANG es_CL.UTF-8
ENV LANGUAGE es_CL:es
ENV LC_ALL es_CL.UTF-8

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist dist/
COPY --from=build /usr/src/app/node_modules node_modules/

CMD [ "node", "--max-old-space-size=1024", "dist/main.js" ]
