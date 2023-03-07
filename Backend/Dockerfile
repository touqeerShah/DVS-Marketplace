FROM node:14-alpine
WORKDIR /app
COPY . .
RUN npm install && printf "ls\nnpm run start\n" > entrypoint.sh
EXPOSE 3000
CMD ["/bin/sh","entrypoint.sh"]
