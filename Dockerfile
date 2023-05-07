FROM node:18.13.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g cross-env

COPY . .

CMD ["npm", "run", "start:dev"]
