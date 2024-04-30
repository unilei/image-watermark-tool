FROM node:20.12.1 AS build-stage

RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install --registry https://registry.npmmirror.com && \
    npm run build && \
    npm cache clean --force
RUN rm -rf ./node_modules

FROM node:20.12.1 AS runtime-stage

RUN mkdir -p /app
WORKDIR /app
COPY --from=build-stage /app/.output /app/.output
COPY ./package.json /app/
ENV TZ="Asia/Shanghai"
EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]
