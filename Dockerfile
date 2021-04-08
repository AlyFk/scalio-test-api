FROM node:12.13-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --only=development
COPY . .
EXPOSE 3000
RUN yarn build

FROM node:12.13-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]