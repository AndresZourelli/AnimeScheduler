# Install dependencies only when needed
FROM node:18-alpine3.16 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/api
COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY . .

RUN yarn build

EXPOSE 4000

CMD ["node", "build/index.js"]