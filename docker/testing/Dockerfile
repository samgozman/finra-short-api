FROM node:18-alpine3.17
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . ./
RUN chmod +x ./docker/testing/entrypoint.sh
RUN npm run build
CMD ["./docker/testing/entrypoint.sh"]