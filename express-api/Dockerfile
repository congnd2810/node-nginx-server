FROM node:16
WORKDIR /
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 7000
RUN yarn prisma generate
RUN yarn build
CMD [ "node", "dist/index.js" ]
