FROM node:20.13.0 as build

WORKDIR /app

COPY package*.json .

COPY . .

RUN yarn

RUN yarn run build

FROM nginx:1.25.3 

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx","-g","daemon off;" ]