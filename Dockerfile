#  Dockerfile for Node Express Backend api (development)

FROM node:18.15.0

ARG NODE_ENV=development

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install npm@9.5.0

# Copy app source code
COPY . .

RUN npm install -g nodemon

# Exports
EXPOSE 9515

RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

CMD ["npm","run dev"]
