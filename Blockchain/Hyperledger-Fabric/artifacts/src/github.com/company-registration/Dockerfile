FROM node:14-alpine
WORKDIR /smartcontract
COPY . .
RUN npm install && npm run build && printf "ls\nnpm run start\n" > entrypoint.sh
EXPOSE 7052
CMD ["/bin/sh","entrypoint.sh"]
