const { Pool } = require("pg");
const { configObj } = require("../config");
const fs = require("fs");
const path = require("path");
// const keyPath = path.resolve(__dirname, "prod-cert", "bc-db301_2.key");
// const certPath = path.resolve(__dirname, "prod-cert", "bc-db301.cer");

/**
 * it will run before every thing and it should be connected
 * @param {*} url mongoDB url
 * @returns
 */
console.log("config", configObj.postgressMQ);
try {
  const pool = new Pool({
    user: configObj.postgressMQ_USER,
    database: configObj.postgressMQ_DB,
    password: configObj.postgressMQ_PASS,
    port: configObj.postgressMQ_PORT,
    host: configObj.postgressMQ_ADDRESS,
    // this object will be passed to the TLSSocket constructor
    // ssl: {
    //   rejectUnauthorized: false,
    //   key: fs.readFileSync(keyPath).toString(),
    //   cert: fs.readFileSync(certPath).toString(),
    // },
  });
  module.exports = { pool };
} catch (error) {
  console.log(error);
  console.log("Error To connect PG try again after 5 second");
}
