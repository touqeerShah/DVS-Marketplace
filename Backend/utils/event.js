var { EventObject } = require("./response");
var { pool } = require("../module/postgressSql");
const fs = require("fs");
const path = require("path");
const configPath = path.resolve(__dirname, "..", "nextblock.txt");
var count = 0;

async function showTransactionData(transactionData, eventObject, blockNumber) {
  // console.log(JSON.stringify(transactionData));
  try {
    const creator = transactionData.actions[0].header.creator;
    console.log(`    - submitted by: ${creator.mspid}}`);
    eventObject.creator = creator.mspid;
    for (const endorsement of transactionData.actions[0].payload.action
      .endorsements) {
      // console.log(
      //   `    - endorsed by: ${endorsement.endorser.id_bytes.toString()}}`
      // );
      eventObject.endorsements.push(endorsement.endorser.mspid);
    }
    console.log("eventObject", eventObject);
    const chaincode =
      transactionData.actions[0].payload.chaincode_proposal_payload.input
        .chaincode_spec;
    console.log(`    - chaincode:${chaincode.chaincode_id.name}`);
    console.log(`    - function:${chaincode.input.args}`);
    eventObject.functionName =
      chaincode.input.args.length != 0
        ? chaincode.input.args[0].toString()
        : "";
    console.log(" eventObject.functionName ", eventObject.functionName);
    if (eventObject.functionName == "") {
      fs.writeFileSync(configPath, blockNumber.toString());
      return;
    }
    eventObject.chaincodeName = chaincode.chaincode_id.name;
    for (let x = 1; x < chaincode.input.args.length; x++) {
      // console.log(`    - arg:${chaincode.input.args[x].toString()}`);
      eventObject.args.push(chaincode.input.args[x].toString());
    }

    if (
      transactionData.actions[0].payload.action.proposal_response_payload
        .extension.response.payload.length == 0
    ) {
      fs.writeFileSync(configPath, blockNumber.toString());
      return;
    }
    var eventResponse = JSON.parse(
      Buffer.from(
        transactionData.actions[0].payload.action.proposal_response_payload
          .extension.response.payload
      ).toString()
    );
    console.log("eventResponse", eventResponse);
    var recordId = "";
    var ts = "";
    if (eventResponse) {
      recordId = eventResponse["transactionId"]
        ? eventResponse["transactionId"]
        : eventResponse["companyId"]
        ? eventResponse["companyId"]
        : eventResponse["lotId"];
      ts = eventResponse["updatedAt"]
        ? eventResponse["updatedAt"]
        : eventResponse["createdAt"];
    }
    console.log("recordId", recordId, "ts", ts);
    if (!recordId) {
      recordId = eventResponse["id"];
      console.log("recordId", recordId);

      if (!recordId) {
        fs.writeFileSync(configPath, blockNumber.toString());
        return;
      }
    }
    if (!ts) {
      ts = eventResponse["id"];
      console.log("ts", ts);

      if (!ts) {
        fs.writeFileSync(configPath, blockNumber.toString());
        return;
      }
    }
    const res = await pool.query(
      "SELECT * FROM PharmaTraceEvent where functionName = $1 AND recordId = $2  ",
      [eventObject.functionName, recordId]
    );
    console.log("Query => ", res.rowCount);
    if (res.rowCount == 0) {
      try {
        console.log("insert");
        const res = await pool.query(
          "INSERT INTO PharmaTraceEvent (transactionId, endorsements,chaincodeName,functionName,args,recordId,ts,eventResponse) VALUES ($1, $2,$3,$4,$5,$6,$7,$8)",
          [
            eventObject.transactionId,
            eventObject.endorsements,
            eventObject.chaincodeName,
            eventObject.functionName,
            eventObject.args,
            recordId,
            ts,
            JSON.stringify(eventResponse),
          ]
        );
        console.log(`insert res `);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(
        'UPDATE PharmaTraceEvent SET "transactionId"=$1, "endorsements"=$2,"chaincodeName"=$3,"functionName"=$4,"args"=$5,"recordId"=$6,"ts"=$7,"eventResponse"=$8 where functionName = $4 AND recordId = $6 '
      );

      const res = await pool.query(
        "UPDATE PharmaTraceEvent SET transactionId=$1, endorsements=$2,chaincodeName=$3,functionName=$4,args=$5,recordId=$6,ts=$7 ,eventResponse=$8 where functionName = $4 AND recordId = $6 ",
        [
          eventObject.transactionId,
          eventObject.endorsements,
          eventObject.chaincodeName,
          eventObject.functionName,
          eventObject.args,
          recordId,
          ts,
          JSON.stringify(eventResponse),
        ]
      );
    }
    try {
      fs.writeFileSync(configPath, blockNumber.toString());
    } catch (error) {
      console.log("file write error");
    }

    return eventObject;
  } catch (error) {
    console.log("error", error);
    fs.writeFileSync(configPath, blockNumber.toString());
  }
}

module.exports.contractListener = async (event) => {
  // console.log("==========================================");
  // console.log(event);
  // The payload of the chaincode event is the value place there by the
  // chaincode. Notice it is a byte data and the application will have
  // to know how to deserialize.
  // In this case we know that the chaincode will always place the asset
  // being worked with as the payload for all events produced.
  const asset = JSON.parse(event.payload.toString());
  // console.log(
  //   `<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}`
  // );
  // show the information available with the event
  console.log(`*** Event: ${event.eventName}:${asset.ID}`);
  // notice how we have access to the transaction information that produced this chaincode event
  const eventTransaction = event.getTransactionEvent();
  // console.log(
  //   `*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`
  // );
  // showTransactionData(eventTransaction.transactionData);
  // // notice how we have access to the full block that contains this transaction
  // const eventBlock = eventTransaction.getBlockEvent();
  // console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
};

module.exports.blockListener = async (event) => {
  // console.log("--------------------------------------------------------------");
  // console.log(`<-- Block Event Received - block number: ${event.blockNumber.toString()}`);
  // console.log(`<-- Block Event Received - block number: ${Object.keys(event)}`);
  nextBlock = fs.readFileSync(configPath, "utf8");
  if (event.blockNumber.toString() == nextBlock.toString()) {
    // count++;
    // if (count == 10) {
    //   process.exit(0);
    // }
    return;
  }
  const transEvents = event.getTransactionEvents();
  for (const transEvent of transEvents) {
    // console.log(`*** transaction event: ${transEvent.transactionId}`);
    EventObject.endorsements = [];
    EventObject.args = [];
    EventObject.transactionId = transEvent.transactionId;
    if (transEvent.transactionData) {
      // console.log("transEvent.transactionData", transEvent.transactionData);
      await showTransactionData(
        transEvent.transactionData,
        EventObject,
        event.blockNumber.toString()
      );
    }
  }
  return;
};
