FROM node:14-alpine

WORKDIR /usr/app

COPY package*.json ./

# install dependencies
RUN npm install --only=production

COPY . .

CMD [ "npm", "start" ]