# Dockerfile for @deltablot/malle
# © 2021 Nicolas CARPi @ Deltablot
# https://github.com/deltablot/malle/

# https://hub.docker.com/hardened-images/catalog/dhi/node/images/node%2Falpine-3.24%2F26-dev/sha256-a4c50c30dff7fc711ad1121c8870810b5aa14fa0042e7bcbf581cffb61f8a256
FROM dhi.io/node@sha256:f1d83ad48584a227f8479390782286f121883b867d51bd366a28807989c30176 AS builder

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

RUN npm ci --ignore-scripts && npm run build

# https://hub.docker.com/hardened-images/catalog/dhi/nginx/images/nginx%2Falpine-3.24%2Fmainline/sha256-a11efe8c07ec6bb03e957995daff696d0dcd9a2e78bc9bb51263d6b32ffa6e00
FROM dhi.io/nginx@sha256:72d317a3908b6dc8216ec2d8e9210271980576b9ea5e939faad24db460e40e71

# add our custom nginx config
COPY ./docker/malle.nginx.conf /etc/nginx/conf.d/default.conf

COPY ./demo /usr/share/nginx/html

COPY --from=builder /home/node/app/dist /usr/share/nginx/html/dist
