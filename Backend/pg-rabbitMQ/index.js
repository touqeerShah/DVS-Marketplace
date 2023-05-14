var { pool } = require("./connect");
const { configObj } = require("./../config");

async function addTransaction(data) {
  console.log("datadatadatadata", configObj.postgressMQ_TABLE);
  try {
    const res = await pool.query(
      `INSERT INTO ${configObj.postgressMQ_TABLE} (uuid, routingKey,userKey,apiName,queue_data,queue_status,error) VALUES ($1, $2,$3,$4,$5,$6,$7)`,
      [
        data.uuid,
        data.routingKey,
        data.userId,
        data.data,
        data.apiName,
        data.status,
        data.error,
      ]
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function isExist(uuid) {
  const query = `SELECT * from ${configObj.postgressMQ_TABLE} WHERE "uuid" = $1`;
  try {
    const res = await pool.query(query, [uuid]); // sends queries
    return res.rowCount != 0;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
}
async function updateTransaction(data) {
  const query = `UPDATE ${configObj.postgressMQ_TABLE} 
    SET "queue_status" = $1, "error" = $2 
    WHERE "uuid" = $3`;
  try {
    await pool.query(query, [data.status, data.error, data.uuid]); // sends queries
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
}

module.exports = { addTransaction, updateTransaction, isExist };
