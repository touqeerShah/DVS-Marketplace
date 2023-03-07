const _ = require("lodash");

/**
 *  this function is create tabel in Coucndb
 * @param {*} username id which is used t connect with counchdb
 * @param {*} password
 * @param {*} url      URL where the keystore is running
 * @param {*} db_name
 * @returns
 */
module.exports.init = async (username, password, url, db_name) => {
  var return_args = {};

  try {
    var nano = await require("nano")(
      "http://" + username + ":" + password + "@" + url
    );
    console.log(
      "initRes ====>",
      "http://" + username + ":" + password + "@" + url
    );

    /**
     * Connect and create DB
     */
    await nano.db
      .create(db_name)
      .then((res) => {
        //Successfully created
        return_args.status = 200;
        return return_args;
      })
      .catch((err) => {
        console.log("err ====>", err);
        //Already exist
        return_args.status = 500;
      });
    return return_args;
  } catch (error) {
    console.log(error);
    return_args.status = 404;
    return_args.message = error;
    console.log("kldmaslkfmdskl");
    return return_args;
  }
};

/**
 * Create new entery DB on new user keys
 * @param {*} username
 * @param {*} password
 * @param {*} url
 * @param {*} db_name
 * @param {*} data insert parameter for DB
 * @returns
 */
module.exports.setKeys = async function (
  username,
  password,
  url,
  db_name,
  data
) {
  var return_args = {};

  var nano = require("nano")("http://" + username + ":" + password + "@" + url);
  // const db = nano.use(db_name);
  var _id = _.get(data, "_id", "");
  if (_id == "") {
    // if parameter are wrong
    return_args.message = "Bad Request";
    return_args.status = 400;
    return return_args;
  }
  await nano
    .use(db_name)
    .insert(data, _id) // insert key into keystore
    .then((res) => {
      return_args.message = "Created and Store keys";
      return_args.status = 200;
      console.log(return_args);

      return return_args;
    })
    .catch((err) => {
      // if fail to store in keystore
      return_args.message = "Database inset failed. " + err + "\n";
      return_args.status = 404;
      console.log(return_args);
      return return_args;
    });
  return return_args;
};
/**
 * this is used  to fetch key of user from counchdb
 * @param {*} username
 * @param {*} password
 * @param {*} url
 * @param {*} db_name
 * @param {*} data query to get data from keystory
 * @returns
 */
module.exports.getKeys = async function (
  username,
  password,
  url,
  db_name,
  data
) {
  var return_args = {};

  var nano = require("nano")("http://" + username + ":" + password + "@" + url);
  var _id = _.get(data, "_id", "");
  if (_id == "") {
    // check parameters
    return_args.message = "Bad Request";
    return_args.status = 400;
    return return_args;
  }
  await nano
    .use(db_name)
    .get(_id) // get query  on keystore
    .then((res) => {
      return_args.message = "Database get. Response: ";
      return_args.status = 200;
      return_args.data = res;
      return return_args;
    })
    .catch((err) => {
      return_args.message = "Database get failed. " + err + "\n";
      return_args.status = 404;
      console.log(return_args);
      return return_args;
    });
  return return_args;
};
