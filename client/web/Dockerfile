FROM node:14-alpine AS development

ENV NODE_ENV=development

WORKDIR ./

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

FROM node:14-alpine AS production

ENV NODE_ENV=production

WORKDIR /

COPY package*.json ./

RUN npm run build

COPY --from=build /app/build /usr/share/nginx/html

RUN npm install --only=production

COPY . .

CMD ["npm", "start"]
