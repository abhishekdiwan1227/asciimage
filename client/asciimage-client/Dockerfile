FROM node:latest AS build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM node:lts-slim
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]