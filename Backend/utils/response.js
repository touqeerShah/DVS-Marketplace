module.exports.responseObj = {
  status: "",
  data: {},
  message: "",
};
module.exports.CollrollerObject = class {
  apiConfig;
  networkConfig;
  requestData;
  status;
  constructor() {}
};
module.exports.EventObject = {
  transactionId: "",
  endorsements: [],
  chaincodeName: "",
  functionName: "",
  args: [],
};
