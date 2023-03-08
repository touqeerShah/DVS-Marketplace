FROM node:16.14-alpine3.14
WORKDIR /smartcontract
COPY . .
RUN npm install && npm run build && printf "ls\nnpm run start\n" > entrypoint.sh
EXPOSE 7052
CMD ["/bin/sh","entrypoint.sh"]
