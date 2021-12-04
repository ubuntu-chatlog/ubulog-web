FROM node:16 as build

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build


FROM node:16

EXPOSE 3000
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package* /app/

RUN npm install

COPY --from=build /app/build /app/build

CMD ["node", "/app/build/index.js"]
