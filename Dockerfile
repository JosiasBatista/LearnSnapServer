FROM node:20

WORKDIR /src

COPY package*.json ./

RUN npm install
&& npm build

COPY . .

EXPOSE 3000

CMD ["npm", "start"]