FROM node:20.11-alpine3.18 as build

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run build

FROM node:20.11-alpine3.18 as prod

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn install --prod

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/.env ./.env
COPY --from=build /usr/src/app/wallet.json ./wallet.json
COPY --from=build /usr/src/app/db ./db


CMD [ "node","dist/index.js" ]
