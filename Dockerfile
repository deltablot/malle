# Dockerfile for @deltablot/malle
# © 2021 Nicolas CARPi @ Deltablot
# https://github.com/deltablot/malle/
FROM node:16-alpine as builder

LABEL dev.deltablot.name="malle" \
    dev.deltablot.description="malle Docker image" \
    dev.deltablot.url="https://malle.deltablot.dev" \
    dev.deltablot.vcs-url="https://github.com/deltablot/malle" \
    dev.deltablot.maintainer="Nicolas CARPi @ Deltablot" \
    dev.deltablot.schema-version="1.0"

USER node

RUN mkdir -p /home/node/app

COPY --chown=node:node ./src /home/node/app/src

COPY --chown=node:node ./tsconfig.json /home/node/app

COPY --chown=node:node ./package.json /home/node/app

COPY --chown=node:node ./package-lock.json /home/node/app

WORKDIR /home/node/app

RUN npm ci && npm run build

FROM nginx:stable-alpine

# add our custom nginx config
COPY ./docker/malle.nginx.conf /etc/nginx/conf.d/default.conf

COPY ./demo /usr/share/nginx/html

COPY --from=builder /home/node/app/dist /usr/share/nginx/html/dist

# allow loading the lib from a different path than in dev
RUN sed -i -e 's/dev/prod/' /usr/share/nginx/html/config.js
