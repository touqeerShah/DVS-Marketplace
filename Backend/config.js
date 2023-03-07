require("dotenv").config();
// console.log(process.env)
module.exports.configObj = {
  MONGO_ADDRESS: process.env.MONGO_ADDRESS,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB: process.env.MONGO_DB,
  MONGO_PASS: process.env.MONGO_PASS,
  MONGO_USER: process.env.MONGO_USER,

  PORT: process.env.PORT,

  sslcertsPath: process.env.keyValueStore,
  sslEnabled: process.env.sslEnabled,
  host: process.env.HOST,
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT,

  PG_ADDRESS: process.env.PG_ADDRESS,
  PG_PORT: process.env.PG_PORT,
  PG_DB: process.env.PG_DB,
  PG_PASS: process.env.PG_PASS,
  PG_USER: process.env.PG_USER,


  rabbitMQ_url: "amqp://test-user:test-user123@localhost:5672",
  rabbitMQ_exchangeName: "logExchange",

  postgressMQ_ADDRESS: "localhost",
  postgressMQ_PORT: "5432",
  postgressMQ_DB: "DVS",
  postgressMQ_TABLE: "public.transaction_queue_logs",
  postgressMQ_PASS: "DVS@2022",
  postgressMQ_USER: "DVS",

};
