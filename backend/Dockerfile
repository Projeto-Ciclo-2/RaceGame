FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install --force --loglevel verbose
RUN npm run build
