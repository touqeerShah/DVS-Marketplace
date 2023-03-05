/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

async function main() {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "connection",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("system1");
    if (!identity) {
      console.log(
        'An identity for the user "system1" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "system1",
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    // const contract = network.getContract("company-registration");
    const contract = network.getContract("company-registration");

    // Evaluate the specified transaction.
    // var arr = '{"id":"system2","userRole":"cmo","status":"pending"}'

    //  getLotDetails
    // var arr = '{"lotId":"pharmaTrace1-lot4"}';

    // var arr = '{"query":{"lotId": {"_id": {"$regex": "lot4"} }}}';
    //based on Item
    var arr =
      '{"query":{"selector": {"lotId": "pharmaTrace1-lot4"}},"isLotcount":true}';
    //based on lot status
    //{"selector": { "_id": { "$regex": "-" }, "status": "activated"}}
    // based on lot shipment location
    // {"selector": {   "shipmentLocations": {"$elemMatch": {   "location": "Malta"}   }}}
    // {"selector": {   "shipmentLocations": {"$elemMatch": {   "location": "Malta", "status": "activated"}   }}}

    // based on lot  recall location and it status
    // {"selector": {   "recallLocations": {"$elemMatch": {   "location": "Malta"}   }}}
    // {"selector": {   "recallLocations": {"$elemMatch": {   "location": "Malta" , "status": "activated"}   }}}

    // based on Item and location
    // var arr =
    //   '{"query":{"selector": {"transactionData": {"$elemMatch": {   "itemId": "test3",   "location": {"location": "karachi"   }}   }}}}';
    // based on ITem with status
    // {"selector": {   "transactionData": {"$elemMatch": {   "itemId": "test3",   "status": "activated"}   }}}
    console.log(arr);
    // var arr =
    //   '{"companyid":"pharmaTrace1","companyName":"evonik","address":"786","status":"activated"}';
    // var arr = '{"userid":"system1","userRole":"wearhouse","status":"pending"}';

    const result = await contract.evaluateTransaction("getByQuery", arr);
    // var arr = '{"transactionId":"1234567222"}'
    // const result = await contract.evaluateTransaction('getTransaction',arr);

    // Testing company-evonik-nft contract
    // readNFT
    // var arr = '{"tokenId":"1234567222"}'
    // const result = await contract.evaluateTransaction('readNFT',arr);
    //GetApproved
    // var arr = '{"tokenId":"1234567222"}'
    // const result = await contract.evaluateTransaction('getApproved',arr);

    // //readNFT
    // var arr = '{"tokenId":"1234567222"}'
    // const result = await contract.evaluateTransaction('readNFT',arr);

    // //totalNFTBalance
    // const result = await contract.evaluateTransaction('totalNFTBalance');
    // //clientNFTBalance
    // const result = await contract.evaluateTransaction('clientNFTBalance');
    //clientNFTBalance
    // const result = await contract.evaluateTransaction('clientNFTBalance');

    //balanceOf
    // var arr = '{"owner":"system1"}'
    // const result = await contract.evaluateTransaction('balanceOf',arr);
    // //ownerOf
    // var arr = '{"tokenId":"1234567222"}'
    // const result = await contract.evaluateTransaction('ownerOf',arr);

    //isOwner
    // var arr = '{"tokenId":"1234567222"}'
    // const result = await contract.evaluateTransaction('isOwner',arr);

    //symbol
    // const result = await contract.evaluateTransaction("symbol");
    console.log("result", result);
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
    console.log(`response: ${JSON.stringify(response_object)}`);
    process.exit(1);
  }
}

main();
