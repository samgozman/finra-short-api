FROM node:18-alpine3.17 AS build-env
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM gcr.io/distroless/nodejs18-debian11
COPY --from=build-env /app /app
WORKDIR /app

ENV PORT=3001
EXPOSE ${PORT}

CMD ["dist/main.js"]
