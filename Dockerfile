FROM node:20

WORKDIR /app

RUN npm install -g yarn --force

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
