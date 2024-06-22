FROM node:20

WORKDIR /app

COPY . /app

RUN rm -rf node_modules && npm install

EXPOSE 8080

CMD [ "npm", "start" ]

