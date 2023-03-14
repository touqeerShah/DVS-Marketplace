var { connectMongoDB, getCollection } = require("../module/mongoDB");
var { CollrollerObject } = require("./response");
var { configObj } = require("../config.js");
var { responseError, isNull } = require("./error");
var _ = require("lodash");
const Ajv = require("ajv");
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
let responseObj = {};
var client;
let getDataFromMongoDB = async (client, collectionName, findRequest, res) => {
  var response = {};

  var apiConfig = await getCollection(
    client,
    configObj.MONGO_DB,
    collectionName,
    findRequest
  );
  if (apiConfig.status != 200) {
    // console.log("apiConfig,", apiConfig);
    return error;
  }
  var isnull = await isNull(apiConfig, "Invalid API Route", res);
  if (isnull.status != 200) {
    return isnull;
  }
  response.status = 200;
  response.data = apiConfig;
  return response;
}
async function validation(schema, data, res) {
  let validateApi = ajv.compile(schema);
  let validAPI = validateApi(data);
  if (!validAPI) {
    responseObj = {
      status: 404,
      message: validateApi.errors,
    };
    return responseObj;
  } else {
    responseObj = {
      status: 200,
      message: validateApi.errors,
    };
    return responseObj;
  }
}
module.exports.init = async (req, res, mathodeType) => {
  console.log("------> req.query.data", req);

  let collrollerObject = new CollrollerObject();
  try {
    if (mathodeType == "POST") {
      collrollerObject.requestData = JSON.parse(req.body.data);
    } else {
      console.log("------> req.query.data", req.query);
      collrollerObject.requestData = JSON.parse(req.query.data);
    }
  } catch (error) {
    responseObj = {
      status: 400,
      message: "JSON is not in Valid Formate",
    };
    return responseObj;
  }
  console.log(
    "collrollerObject.requestData.apiName",
    collrollerObject.requestData.apiName
  );
  var apiConfig = await getDataFromMongoDB(
    client,
    "ApiRequest",
    { apiName: collrollerObject.requestData.apiName },
    res
  );
  if (apiConfig.status != 200) {
    return apiConfig;
  }
  collrollerObject.apiConfig = apiConfig.data;
  console.log("collrollerObject.requestData.apiName", collrollerObject);
  try {
    var validationRES = await validation(
      collrollerObject.apiConfig.data.schema,
      collrollerObject.requestData,
      res
    );
    if (validationRES.status != 200) {
      return validationRES;
    }
    validationRES = await validation(
      collrollerObject.apiConfig.data.parameters,
      collrollerObject.requestData.parameters,
      res
    );
    if (validationRES.status != 200) {
      return validationRES;
    }
  } catch (error) {
    responseObj = {
      status: 400,
      message: error,
    };
    return responseObj;
  }

  console.log("herer comer");
  var organization = collrollerObject.requestData.organization.split("_")[0];
  var networkConfig = await getDataFromMongoDB(
    client,
    "Network",
    { name: organization },
    res
  );

  if (networkConfig.status != 200) {
    networkConfig.message = "No Orgainzation Config Found";
    return networkConfig;
  } else {
    collrollerObject.networkConfig = networkConfig.data;
    collrollerObject.status = 200;
    return collrollerObject;
  }
};
module.exports.initQueue = async (data, res, mathodeType) => {
  let collrollerObject = new CollrollerObject();
  console.log('JSON.parse(data)', typeof (data));
  collrollerObject.requestData = JSON.parse(data)
  // try {
  //   if (mathodeType == "POST") {
  //     collrollerObject.requestData = JSON.parse(req.body.data);
  //   } else {
  //     console.log("------> req.query.data", req.query);
  //     collrollerObject.requestData = JSON.parse(req.query.data);
  //   }
  // } catch (error) {
  //   responseObj = {
  //     status: 400,
  //     message: "JSON is not in Valid Formate",
  //   };
  //   return responseObj;
  // }
  console.log(
    "collrollerObject.requestData.apiName",
    collrollerObject.requestData.apiName
  );
  var apiConfig = await getDataFromMongoDB(
    client,
    "ApiRequest",
    { apiName: collrollerObject.requestData.apiName },
    res
  );
  if (apiConfig.status != 200) {
    return apiConfig;
  }
  collrollerObject.apiConfig = apiConfig.data;
  console.log("collrollerObject.requestData.apiName", collrollerObject);
  try {
    var validationRES = await validation(
      collrollerObject.apiConfig.data.schema,
      collrollerObject.requestData,
      res
    );
    if (validationRES.status != 200) {
      console.log("requestData");
      return validationRES;
    }
    validationRES = await validation(
      collrollerObject.apiConfig.data.parameters,
      collrollerObject.requestData.parameters,
      res
    );
    if (validationRES.status != 200) {
      console.log("parameters", validationRES.message);

      return validationRES;
    }
  } catch (error) {
    responseObj = {
      status: 400,
      message: error,
    };
    return responseObj;
  }

  console.log("herer comer");
  var organization = collrollerObject.requestData.organization.split("_")[0];
  console.log("organization", organization);
  var networkConfig = await getDataFromMongoDB(
    client,
    "Network",
    { name: organization },
    res
  );

  if (networkConfig.status != 200) {
    networkConfig.message = "No Orgainzation Config Found";
    return networkConfig;
  } else {
    collrollerObject.networkConfig = networkConfig.data;
    collrollerObject.status = 200;
    return collrollerObject;
  }
};

module.exports.loadMongo = async () => {
  client = await connectMongoDB(
    "mongodb://" +
    configObj.MONGO_USER +
    ":" +
    configObj.MONGO_PASS +
    "@" +
    configObj.MONGO_ADDRESS +
    ":" +
    configObj.MONGO_PORT
  );
  return client;
}
// loadMongo();

module.exports.getDataFromMongoDBExternal = getDataFromMongoDB

