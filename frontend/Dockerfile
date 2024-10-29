FROM node:22-alpine
WORKDIR /app
COPY . .
# RUN npm install -g npm@10.9.0
RUN npm install --force --loglevel verbose
RUN npm run build
