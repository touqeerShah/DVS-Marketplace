var _ = require("lodash");
var { responseObj } = require("./response");

module.exports.responseError = async (result, res) => {
    console.log(result);
    return result;
};

/**
 *
 * @param {*} result data which need to check that it is empty or not
 * @param {*} message
 * @param {*} res
 * @returns
 */
module.exports.isNull = async (result, message, res) => {
    if (_.get(result, "data", []).length == 0) {
        responseObj.status = 404;
        responseObj.message = message;
        return responseObj;
    } else {
        responseObj.status = 200;
        return responseObj;
    }
};
