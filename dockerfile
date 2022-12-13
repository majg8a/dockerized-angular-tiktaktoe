FROM node:12-alpine
RUN npm install -g @angular/cli@12
USER node
WORKDIR /app
EXPOSE 4200
CMD ["ng","serve","--host","0.0.0.0", "--disableHostCheck=true", "--poll", "100"]
