FROM docker.io/node:lts-bullseye

COPY ./app /app

WORKDIR /app

ENV NODE_ENV=development

RUN rm -rf node_modules dist

RUN mkdir dist

RUN npm install -g pnpm

RUN yes | pnpm i

# CMD pnpm run serve
CMD pnpm run dev
# CMD pnpm run devgen