# Dockerfile
# Stage 1 - the build process
FROM node:alpine as builder
RUN mkdir /opt/app
WORKDIR /opt/app
COPY . ./
RUN npm i
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine

COPY .docker/nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /opt/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
