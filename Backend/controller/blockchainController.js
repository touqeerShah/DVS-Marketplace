var {
  invoke,
  query,
  registerUser,
  enroll,
} = require("../module/hyperledger-sdk");
var { init } = require("../utils/helper");
const { v4: uuidv4 } = require("uuid");
var { addTransaction } = require("../pg-rabbitMQ");
var TransactionsMQ = require("../module/rabbitMQ");
const transactionsMQ = new TransactionsMQ();

module.exports.addQueue = async (req, res) => {
  try {
    var uuid = uuidv4();
    console.log("req.body", req.body);
    let reqdata = JSON.parse(req.body.data);
    var response = await transactionsMQ.transactions(
      uuid,
      "invoke",
      reqdata.userId,
      req.body.data,
      reqdata.pinHash
    );
    var dbResponse;
    if (response) {
      console.log("data", data);
      var data = {
        uuid: uuid,
        routingKey: "invoke",
        userId: reqdata.userId,
        data: req.body.data,
        apiName: reqdata.apiName,
        status: "pending",
        error: "",
      };
      dbResponse = await addTransaction(data);
    }
    if (response && dbResponse) {
      res.send({ uuid: uuid, status: 200, message: "wait for Queue " });
    } else if (!response) {
      res.send({ status: 400, message: "Error In  Queue " });
    } else if (!dbResponse) {
      res.send({ status: 400, message: "Error In DB " });
    }
  } catch (error) {
    console.log("error in routes", error);
  }
};
/**
 * This function is used to register user when we create user it will generate user Private key and Public Key and store them into KeyStore
 * @param {*} req
 * @param {*} res
 */
module.exports.register = async (req, res) => {
  var collrollerObject = await init(req, res, "POST"); /// this function is connect to mongoDB,get API Defination  and Network config for that bucket
  if (collrollerObject.status != 200) {
    res.send(collrollerObject);
  }
  console.log("collrollerObject", collrollerObject);
  await registerUser(
    //here we used SDK to Connect to the CA of respective Organization Bucket and generate user PKI
    collrollerObject.requestData.userId,
    collrollerObject.apiConfig.data.isCreator,
    collrollerObject.requestData.organization,
    collrollerObject.requestData.companyId,
    collrollerObject.networkConfig.data,
    collrollerObject.requestData.pinHash
  )
    .then(async (value) => {
      if (value.status != 200) {
        res.send(value);
      } else {
        res.send(value);
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

/**
 * This function is used to register user when we create user it will generate user Private key and Public Key and store them into KeyStore
 * @param {*} req
 * @param {*} res
 */
module.exports.registerWithSignature = async (req, res) => {
  var collrollerObject = await init(req, res, "POST"); /// this function is connect to mongoDB,get API Defination  and Network config for that bucket
  if (collrollerObject.status != 200) {
    res.send(collrollerObject);
  }
  console.log("collrollerObject", collrollerObject);
  return await registerUser(
    //here we used SDK to Connect to the CA of respective Organization Bucket and generate user PKI
    collrollerObject.requestData.userId,
    collrollerObject.apiConfig.data.isCreator,
    collrollerObject.requestData.organization,
    collrollerObject.requestData.companyId,
    collrollerObject.networkConfig.data,
    collrollerObject.requestData.pinHash
  );
};
/**
 * This function is used to when we do transaction on Blockchain
 * @param {*} req
 * @param {*} res
 */
module.exports.insert = async (req, res) => {
  var collrollerObject = await init(req, res, "POST"); /// this function is connect to mongoDB,get API Defination  and Network config for that bucket
  if (collrollerObject.status != 200) {
    // If any record not found on MongoDB like API Defination or Network Config
    res.send(collrollerObject);
  } else {
    await invoke(
      //here we call SDK to connect to Blockchain and invoke our Transaction
      collrollerObject.requestData.userId,
      collrollerObject.apiConfig.data.channel,
      collrollerObject.apiConfig.data.contractName,
      collrollerObject.apiConfig.data.functionName,
      collrollerObject.requestData.parameters,
      collrollerObject.networkConfig.data,
      collrollerObject.requestData.pinHash
    )
      .then((value) => {
        res.send(value);
      })
      .catch((err) => {
        res.send(err);
      });
  }
};
/**
 * This is used to all query call to the blockchain when every we need to get data we will used this controller
 * @param {*} req
 * @param {*} res
 */
module.exports.get = async (req, res) => {
  // here we get data from monogo about api called

  var collrollerObject = await init(req, res, "POST"); /// this function is connect to mongoDB,get API Defination  and Network config for that bucket
  // console.log("get ===>", collrollerObject);
  if (collrollerObject.status != 200) {
    // console.log("collrollerObject ===>", collrollerObject);

    res.send(collrollerObject);
  } else {
    // console.log(
    //   "collrollerObject.requestData.parameters",
    //   collrollerObject.requestData.parameters
    // );
    await query(
      // here we call query SDK of Hyperledger Fabric
      collrollerObject.requestData.userId, // the user who want to do transaction
      collrollerObject.apiConfig.data.channel, // channel name
      collrollerObject.apiConfig.data.contractName, //smart contract name
      collrollerObject.apiConfig.data.functionName, // function name inside the contract
      collrollerObject.requestData.parameters, // what are the parameter's
      collrollerObject.networkConfig.data // this will contain Network config which Peer , CA and which org is doing transaction
    )
      .then((value) => {
        // console.log("value", value);
        res.send(value);
      })
      .catch((err) => {
        console.log("err", err);
        res.send(err);
      });
  }
};

/**
 * This is used to enroll admin for every orgainzation bucket it will call only once
 * @param {*} req  // all parameter which are required to enroll admin
 * {"transactionCode":"004","apiName":"enrollAdmin","parameters":{"id":"admin"},"organization":"Orgnaizaiton1"}
 * @param {*} res
 */
module.exports.enrollAdmin = async (req, res) => {
  // here we get data from monogo about api called
  var collrollerObject = await init(req, res, "POST"); // this function is connect to mongoDB,get API Defination  and Network config for that bucket
  console.log("collrollerObject.requestDat", collrollerObject);

  if (collrollerObject.status != 200) {
    res.send(collrollerObject);
  }
  await enroll(
    // this is Hyperledger SDK Call to enroll Edmin wit CA
    collrollerObject.requestData.organization,
    collrollerObject.networkConfig.data
  )
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      res.send(err);
    });
};
