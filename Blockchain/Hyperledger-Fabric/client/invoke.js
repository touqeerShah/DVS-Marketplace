/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "connection",
      "connection-org1.json"
    );

    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("system1");
    if (!identity) {
      console.log(
        'An identity for the user "system" does not exist in the wallet'
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

    const mspId = network.getGateway().getIdentity().mspId;
    const myOrgPeers = network.getChannel().getEndorsers(mspId);
    // console.log(myOrgPeers);
    // Get the contract from the network.
    const contract = network.getContract("company-registration");
    // Submit the specified transaction.
    //For Usere management Contract
    // var arr = `"system5","created"`
    // var arr = '{"id":"system5","userRole":"wearhouse","status":"pending"}'
    // console.log("--->",contract.createTransaction("updateUserStatus").setEndorsingPeers(myOrgPeers));
    // await contract.createTransaction("createUser").setEndorsingPeers(myOrgPeers).submit(arr)

    //For Company Registration Contract

    // var arr =
    //   '{"companyId":"pharmaTrace","companyName":"evonik","address":"786","status":"activated"}';
    // await contract
    //   .createTransaction("createCompany")
    //   .setEndorsingPeers(myOrgPeers)
    //   .submit(arr);

    // createLot;
    var arr =
      '{"lotId":"pharmaTrace1-lot4","productId":"786","drugId":"test","lotNumber": "pharmatrace","batchLotData": "hello","expirationDate": "01-02-1995","manufacturingDate": "manufacturingDate","manufacturingSite": "manufacturingSite"}';
    // var arr =
    //   '{"transactionId":"pharmaTrace1-lot9","productId":"786","drugId":"test"}';
    // updateLotLocation;
    //updateLotRecallLocation
    // var arr =
    //   '{"transactionId":"pharmaTrace1-lot4","newLocation":"test3","isChangeStatus":true}';
    // updateLotLocationStatus
    // var arr =
    //   '{"transactionId":"pharmaTrace1-lot4","location":"test3","status":"deactivate"}';
    // updateItemLocation;
    // var arr =
    //   '{"transactionId":"pharmaTrace1-lot9","newlocation":"karachi","items":["item6"]}';
    // // updateItemStatus
    // var arr =
    //   '{"transactionId":"pharmaTrace1-lot4","status":"deactivate","items":["test1"]}';
    // // updateItemStatus
    // var arr = '{"lotId":"pharmaTrace1-lot9","itemsId":["item6","item7"]}';
    // // updateMetaData
    // var arr = '{"lotId":"pharmaTrace1-lot9","batchLotData":{"type":"test"}}';

    let result = await contract
      .createTransaction("createLot")
      .setEndorsingPeers(myOrgPeers)
      .submit(arr);
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
    // var arr = '{"companyid":"pharmaTrace_786","newStatus":"activated"}'
    // await contract.createTransaction("updateCompanyStatus").setEndorsingPeers(myOrgPeers).submit("pharmaTrace_786","activated")

    // var arr = '{"transactionId":"1234567222","encryptedData":"askjbdksjabdjsabjdbsajkdbsabdjksdjsbjdsakdsjdjskaj","status":"created","allowToView":[{"userId":"system1","encryptedData":"sahbdjahsbdhjsbdhjsabhjsbdhj"},{"userId":"system2","encryptedData":"idjowijdijncjjrbfj vskjndsc2882un3e282he"}]}'
    // await contract.createTransaction("createTransaction").setEndorsingPeers(myOrgPeers).submit(arr)

    // var arr = '{"transactionId":"1234567222","allowToView":["system1"]}'
    // await contract.createTransaction("addAllowToView").setEndorsingPeers(myOrgPeers).submit(arr)

    // var arr = '{"transactionId":"12345678","permissionUserId":"system1"}'
    // await contract.createTransaction("suspendAllowToView").setEndorsingPeers(myOrgPeers).submit(arr)

    // var arr = '{"transactionId":"12345678","permissionUserId":"system1"}'
    // await contract.createTransaction("activateAllowToView").setEndorsingPeers(myOrgPeers).submit(arr)

    // Testing company-evonik-nft contract
    //mintNFT
    // var arr = '{"tokenId":"1234567223","fileName":"askjbdksjabdjsabjdbsajkdbsabdjksdjsbjdsakdsjdjskaj","hash":"adasdasdqwdqw23e312wd3rs1d24fr4dcwcwe","ipfsPath":"ipfs://adasdasdqwdqw23e312wd3rs1d24fr4dcwcwe/test","comments":"thesing purpose"}'
    // await contract.createTransaction("mintNFT").setEndorsingPeers(myOrgPeers).submit(arr)

    // //activeNFT
    // var arr = '{"tokenId":"1234567222"}'
    // await contract.createTransaction("activeNFT").setEndorsingPeers(myOrgPeers).submit(arr)

    // setOption
    // var arr = '{"name":"Evonik","symbol": "$"}'
    // await contract.createTransaction("setOption").setEndorsingPeers(myOrgPeers).submit(arr)

    //setApprovalForAll
    // var arr = '{"tokenId":"1234567222","operator": "system2"}'
    // await contract.createTransaction("setApprovalForAll").setEndorsingPeers(myOrgPeers).submit(arr)

    //setApprovalForAll
    // var arr = '{"tokenId":"1234567222"}'
    // await contract.createTransaction("burn").setEndorsingPeers(myOrgPeers).submit(arr)

    console.log("Transaction has been submitted");

    // Disconnect from the gateway.
    await gateway.disconnect();
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
