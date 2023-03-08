/**
 * This file is contain logic to connect blockchain to do transation or create user
 * it will expose different function which are based on HL SDK invoke ,query , register user and ennroll admin
 *
 */

const { Gateway, Wallets } = require("fabric-network");
const crypto = require("crypto");
const { blockListener, contractListener } = require("../utils/event");
const fs = require("fs");

const path = require("path");
("use strict");
const FabricCAServices = require("fabric-ca-client");
const { init, setKeys, getKeys } = require("../module/keyStore");
const { keyEncrypt, keyDecrypt } = require("../module/encryption");
/**
 * This function is used to invoke tracnsaction to blockchain
 * @param {*} userid   user id who is doing tranisaction
 * @param {*} channel_name   name of channel where smart contract in install
 * @param {*} chaincode_name   contract name which function you want to execute
 * @param {*} function_name  the name of function which we want to execute on smart contract
 * @param {*} function_arguments  parameter which are need to pass the fucntion call
 * @param {*} ccp  // this contain network configuration
 * @returns
 */
module.exports.invoke = async function (
  userid,
  channel_name,
  chaincode_name,
  function_name,
  function_arguments,
  ccp
) {
  return_args = {};

  try {
    /**
     *  we call fucntion who will connect to key-store get the used key and decrypt it
     *  it will return two values on key and other wallet module object
     */
    var resConnectCounchDB = await connectCounchDB(ccp, userid); //
    // console.log("resConnectCounchDB", resConnectCounchDB);
    if (resConnectCounchDB.status == 404) {
      return resConnectCounchDB;
    }

    const gateway = new Gateway();
    var wallet = resConnectCounchDB.wallet;
    await gateway.connect(ccp, {
      wallet,
      identity: userid,
      discovery: {
        enabled: true,
        asLocalhost: true,
      },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channel_name);
    const mspId = network.getGateway().getIdentity().mspId;
    const myOrgPeers = network.getChannel().getEndorsers(mspId); // here we send request to only those peer which are belown to that company bucket
    // Get the contract from the network.
    const contract = network.getContract(chaincode_name);

    var result = await contract
      .createTransaction(function_name)
      .setEndorsingPeers(myOrgPeers)
      .submit(JSON.stringify(function_arguments));

    console.log("Transaction has been submitted");
    var response_object = {};
    var response = JSON.parse(result.toString());
    if (response["code"]) {
      response_object.status = response["code"];
      response_object.message = response["message"];
    } else {
      response_object.status = 200;
      response_object.message = "SUCCESS";
      response_object.data = JSON.parse(result.toString());
    }
    console.log(
      `Transaction has been evaluated, result is: ${JSON.stringify(
        response_object
      )}`
    );
    await gateway.disconnect();
    // blockchainevent(userid, ccp, channel_name, resConnectCounchDB);
    // return_args.status = 200; // if every thing want good
    // return_args.message = "SUCCESS";
    return JSON.stringify(response_object);
  } catch (error) {
    var firstIndex = error.message.indexOf('{"message":');
    var endingIndex = error.message.indexOf('"}', firstIndex);
    let result = error.message.substring(firstIndex, endingIndex + 2);
    console.log("result", result);
    var response_object = {};
    var response = JSON.parse(result);
    if (response["code"]) {
      response_object.status = response["code"];
      response_object.message = response["message"];
    } else {
      response_object.status = 200;
      response_object.message = "SUCCESS";
      response_object.data = JSON.parse(result.toString());
    }
    return response_object;
    // process.exit(1);
  }
};
/**
 *  this function is export which is used to get data for blockchain
 * @param {*} userid   user id who is doing tranisaction
 * @param {*} channel_name   name of channel where smart contract in install
 * @param {*} chaincode_name   contract name which function you want to execute
 * @param {*} function_name  the name of function which we want to execute on smart contract
 * @param {*} function_arguments  parameter which are need to pass the fucntion call
 * @param {*} ccp  // this contain network configuration
 * @returns  it will retrun object with status and message if status good then with data.
 */
module.exports.query = async function (
  userid,
  channel_name,
  chaincode_name,
  function_name,
  function_arguments,
  ccp
) {
  return_args = {};
  /*
   * SPDX-License-Identifier: Apache-2.0
   */

  try {
    /**
     *  we call fucntion who will connect to key-store get the used key and decrypt it
     *  it will return two values on key and other wallet module object
     */
    var resConnectCounchDB = await connectCounchDB(ccp, userid);
    if (resConnectCounchDB.status == 404) {
      return resConnectCounchDB;
    }
    const gateway = new Gateway();
    var wallet = resConnectCounchDB.wallet;
    // Create a new gateway for connecting to our peer node.
    await gateway.connect(ccp, {
      wallet,
      identity: userid,
      discovery: {
        enabled: true,
        asLocalhost: true,
      },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channel_name);

    // Get the contract from the network.
    const contract = network.getContract(chaincode_name);
    const result = await contract.evaluateTransaction(
      function_name,
      JSON.stringify(function_arguments)
    );

    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );

    // Disconnect from the gateway.
    await gateway.disconnect();
    await wallet.remove(userid);

    var response_object = {};
    var response = JSON.parse(result.toString());
    if (response["code"]) {
      response_object.status = response["code"];
      response_object.message = response["message"];
    } else {
      response_object.status = 200;
      response_object.message = "SUCCESS";
      response_object.data = JSON.parse(result.toString());
    }
    console.log(
      `Transaction has been evaluated, result is: ${JSON.stringify(
        response_object
      )}`
    );
    return JSON.stringify(response_object); // here we send data back to api call
  } catch (error) {
    var firstIndex = error.message.indexOf('{"message":');
    var endingIndex = error.message.indexOf('"}', firstIndex);
    let result = error.message.substring(firstIndex, endingIndex + 2);
    console.log("result", result);
    var response_object = {};
    var response = JSON.parse(result);
    if (response["code"]) {
      response_object.status = response["code"];
      response_object.message = response["message"];
    } else {
      response_object.status = 200;
      response_object.message = "SUCCESS";
      response_object.data = JSON.parse(result.toString());
    }
    return response_object;
  }
};

/**
 * this function register new user with CA and store certifcate and key with it id into key store
 * @param {*} userid //new user id which is used to register
 * @param {*} isCreator  // this will tell that if have permission to create new user or not
 * @param {*} organization  // comapany name in which user belong to
 * @param {*} companyId     // company id  this value is store in certifciate to fetch inside contract to know which company this used belongs
 * @param {*} ccp           // network configutration
 * @returns
 */
module.exports.registerUser = async function (
  userid,
  isCreator,
  organization,
  companyId,
  ccp
) {
  return_args = {};
  /*
   * SPDX-License-Identifier: Apache-2.0
   */
  try {
    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities["ca." + organization + ".example.com"].url; // here we get CA url to connect with it
    console.log(caURL);
    const ca = new FabricCAServices(caURL);
    const walletPath = path.join(process.cwd(), "wallet"); // here we need wallet object
    const wallet = await Wallets.newFileSystemWallet(walletPath); // path before store user key into key store we store them local

    // build a user object for authenticating with the CA
    var getAdmin = {
      _id: ccp.keyCounchdb.username, // here we get admin name of this company bucket
    };
    /**
         *  ccp.keyCounchdb.username,   user name  to connect with keystore
            ccp.keyCounchdb.password,   password of keystor
            ccp.keyCounchdb.url,        address where keystore in runnig
            ccp.keyCounchdb.db_name,    name of database
            getAdmin                    query to get result
         */
    var adminIdentityRes = await getKeys(
      // here we get admin certifcate and key
      ccp.keyCounchdb.username,
      ccp.keyCounchdb.password,
      ccp.keyCounchdb.url,
      ccp.keyCounchdb.db_name,
      getAdmin
    );
    if (adminIdentityRes.status == 404) {
      // if not found that create admin certificate and key first and try to regirster user
      adminIdentityRes.message = "Admin key not Found";
      return adminIdentityRes;
    }
    adminIdentityRes.data.key = JSON.parse(
      keyDecrypt(adminIdentityRes.data.key, ccp.securet) // decrypt the key before use them
    );

    var getUser = {
      // query to check user is not exist
      _id: userid,
    };
    /**
         *  ccp.keyCounchdb.username,   user name  to connect with keystore
            ccp.keyCounchdb.password,   password of keystor
            ccp.keyCounchdb.url,        address where keystore in runnig
            ccp.keyCounchdb.db_name,    name of database
            getAdmin                    query to get result
         */
    var userIdentityRes = await getKeys(
      ccp.keyCounchdb.username,
      ccp.keyCounchdb.password,
      ccp.keyCounchdb.url,
      ccp.keyCounchdb.db_name,
      getUser
    );
    if (userIdentityRes.status == 200) {
      userIdentityRes.message = "user key already Found";
      return userIdentityRes;
    }
    console.log("adminIdentityRes", adminIdentityRes);
    await wallet.put(adminIdentityRes.data._id, adminIdentityRes.data.key);
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentityRes.data.key.type);
    console.log(provider);

    const adminUser = await provider.getUserContext(
      adminIdentityRes.data.key,
      adminIdentityRes.data._id
    );

    console.log("ccp.affiliation", ccp.keyCounchdb.affiliation);
    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: ccp.keyCounchdb.affiliation,
        enrollmentID: userid,
        role: "client",
        attrs: [
          // those are extra valuse which are used inside contract to less dependend on parameter information
          {
            name: "userid",
            value: userid,
            ecert: true,
          },
          {
            name: "creator",
            value: isCreator,
            ecert: true,
          },
          {
            name: "mint",
            value: "true",
            ecert: true,
          },
          {
            name: "companyId",
            value: companyId,
            ecert: true,
          },
        ],
      },
      adminUser
    );
    console.log("secret", secret);
    const enrollment = await ca.enroll({
      enrollmentID: userid,
      enrollmentSecret: secret,
    });

    console.log("enrollment", enrollment);
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: adminIdentityRes.data.key.mspId,
      type: adminIdentityRes.data.key.type,
    };
    console.log("x509Identity", x509Identity);

    const pubKeyObject = crypto.createPublicKey({
      // create public key from user private
      key: enrollment.key.toBytes(),
      format: "pem",
    });

    var publicKey = pubKeyObject.export({
      format: "pem",
      type: "spki",
    });
    //here we encrypt the new generated before store them into keystore
    publicKey = keyEncrypt(publicKey, ccp.securet);
    var encryptx509Identity = keyEncrypt(
      JSON.stringify(x509Identity),
      ccp.securet
    );
    console.log("publicKey", publicKey);

    // console.log("encryptx509Identity", encryptx509Identity);
    var keystore = { _id: userid, key: encryptx509Identity, publicKey };
    // store key into key store
    var userRes = await setKeys(
      ccp.keyCounchdb.username,
      ccp.keyCounchdb.password,
      ccp.keyCounchdb.url,
      ccp.keyCounchdb.db_name,
      keystore
    );
    if (userRes.status == 404) {
      return userRes;
    }
    console.log("userRes", userRes);

    await wallet.remove(adminIdentityRes.data._id); // remove key on local wallet path
    // here we store  x509Identity to keystore

    console.log(
      'Successfully registered and enrolled admin user "' +
      userid +
      '" and imported it into the wallet'
    );

    return userRes; // response back to API call
  } catch (error) {
    console.error(`Failed to register user "${userid}": ${error}`);
    return_args.status = 400;
    return_args.message = error;
    return return_args;
  }
};
/**
 * this function is used to create admin of the company bucket
 * @param {*} companyId this tell which comapany bucket admin have to create
 * @param {*} ccp  // network config from mongoDB
 * @returns
 */
module.exports.enroll = async (companyId, ccp) => {
  return_args = {};
  try {
    // this function is used to cread DB if not exist
    // ccp.keyCounchdb.username,   user name  to connect with keystore
    //     ccp.keyCounchdb.password,   password of keystor
    //     ccp.keyCounchdb.url,        address where keystore in runnig
    //     ccp.keyCounchdb.db_name,    name of database
    var initRes = await init(
      ccp.keyCounchdb.username,
      ccp.keyCounchdb.password,
      ccp.keyCounchdb.url,
      ccp.keyCounchdb.db_name
    );
    // console.log("initRes ====>", initRes);
    if (initRes.status == 404) {
      return initRes;
    }
    // console.log("ccp===>", ccp);
    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities["ca." + companyId + ".example.com"];
    const MSP = ccp.adminIdentity.mspId; // here we get CA url to connect with it
    // console.log("caInfo===>", caInfo);

    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices( // connect to CA with it URL
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    var getAdmin = {
      _id: ccp.keyCounchdb.username,
    };
    var adminIdentityRes = await getKeys(
      // check admin certificate is not exist before
      ccp.keyCounchdb.username,
      ccp.keyCounchdb.password,
      ccp.keyCounchdb.url,
      ccp.keyCounchdb.db_name,
      getAdmin
    );
    // console.log("adminIdentityRes ====>", adminIdentityRes);

    if (adminIdentityRes.status == 200) {
      // if exist then do not do any thing and sen it to user
      adminIdentityRes.message = "Admin key Already Found";
      return adminIdentityRes;
    }
    // console.log("caInfo.enrollmentID ====>", caInfo);

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: caInfo.enrollmentID,
      enrollmentSecret: caInfo.enrollmentSecret,
      attr_reqs: [{ name: "admin", optional: true }],
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: caInfo.mspId,
      type: "X.509",
    };
    // console.log("x509Identity ====>", x509Identity);

    // generate public key from private ket
    const pubKeyObject = crypto.createPublicKey({
      key: enrollment.key.toBytes(),
      format: "pem",
    });

    var publicKey = pubKeyObject.export({
      format: "pem",
      type: "spki",
    });
    //encrypt the keys before store them in key-store
    publicKey = keyEncrypt(publicKey, ccp.securet);
    var encryptx509Identity = keyEncrypt(
      JSON.stringify(x509Identity),
      ccp.securet
    );
    var keystore = {
      _id: ccp.keyCounchdb.username,
      key: encryptx509Identity,
      publicKey,
    };

    console.log(ccp.keyCounchdb.username,
      ccp.keyCounchdb.password,
      ccp.keyCounchdb.url,
      ccp.keyCounchdb.db_name);
    //Store keys in key-store
    var userRes = await setKeys(
      ccp.keyCounchdb.username,
      ccp.keyCounchdb.password,
      ccp.keyCounchdb.url,
      ccp.keyCounchdb.db_name,
      keystore
    );
    if (userRes.status == 404) {
      return userRes;
    }
    // await wallet.remove(adminIdentity.data._id);
    // here we store  x509Identity to keystore

    console.log(
      'Successfully registered and enrolled admin user "' +
      ccp.keyCounchdb.username +
      '" and imported it into the wallet'
    );
    return userRes;
  } catch (error) {
    return_args.status = 400;
    return_args.message = error;
    return return_args;
  }
};

/**
 * This function is used to invoke tracnsaction to blockchain
 * @param {*} userid   user id who is doing tranisaction
 * @param {*} channel_name   name of channel where smart contract in install
 * @param {*} ccp  // this contain network configuration
 * @returns
 */
blockchainevent = async function (
  userid,
  ccp,
  channel_name,
  resConnectCounchDB
) {
  return_args = {};

  const configPath = path.resolve(__dirname, "..", "nextblock.txt");

  try {
    // initialize the next block to be 0
    let nextBlock = 0;

    // check to see if there is a next block already defined
    if (fs.existsSync(configPath)) {
      nextBlock = await fs.readFileSync(configPath, "utf8");
      // console.log("nextBlock", nextBlock.toString());
    }

    const gateway = new Gateway();
    var wallet = resConnectCounchDB.wallet;
    await gateway.connect(ccp, {
      wallet,
      identity: userid,
      discovery: {
        enabled: true,
        asLocalhost: true,
      },
    });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channel_name);
    for (let index = 0; index < 10; index++) {
      const listener = await network.addBlockListener(
        blockListener,
        // set the starting block for the listener
        { filtered: false, startBlock: parseInt(nextBlock, 10) }
      );
    }
    await wallet.remove(userid);
    if (fs.existsSync(configPath)) {
      nextBlock = await fs.readFileSync(configPath, "utf8");
      // console.log("nextBlock", nextBlock.toString());
    }
    console.log(`Listening for block events, nextblock: ${nextBlock}`);

    // start processing, looking for entries in the ProcessingMap
    // processPendingBlocks(ProcessingMap);
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`); // incase transaction have some error
  }
};

/**
 *
 * @param {*} ccp  network configration
 * @param {*} userid user id which key we want to fetch from key store
 * @returns
 */
async function connectCounchDB(ccp, userid) {
  const walletPath = path.join(process.cwd(), "wallet"); // create wallet object
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  var getAdmin = {
    // create request to get user key from key-store
    _id: userid,
  };
  var adminIdentityRes = await getKeys(
    ccp.keyCounchdb.username,
    ccp.keyCounchdb.password,
    ccp.keyCounchdb.url,
    ccp.keyCounchdb.db_name,
    getAdmin
  );
  if (adminIdentityRes.status == 404) {
    // if not found the error return
    adminIdentityRes.message = "User key not Found or Invalid User";
    return adminIdentityRes;
  }
  adminIdentityRes.data.key = JSON.parse(
    keyDecrypt(adminIdentityRes.data.key, ccp.securet)
  );
  adminIdentityRes.data.publicKey = keyDecrypt(
    // here decrypt the key and send back
    adminIdentityRes.data.publicKey,
    ccp.securet
  );
  await wallet.put(adminIdentityRes.data._id, adminIdentityRes.data.key); // store key local volume
  adminIdentityRes.wallet = wallet; // we add wallet object with the response which is used to do remove key once done with use

  return adminIdentityRes;
}
