FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

RUN chmod +x ./start.sh

CMD ["sh", "./start.sh"]
