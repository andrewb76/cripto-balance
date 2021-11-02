FROM node:16

ENV NODE_ENV=development
# ENV NODE_ENV=production


RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 3010 3030
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
