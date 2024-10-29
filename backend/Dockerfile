FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json .env ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
