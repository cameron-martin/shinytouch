FROM node:11.13-alpine

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

USER node

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn build

EXPOSE 8080

ENV NODE_ENV=production

CMD [ "node", "dist/index.js" ]