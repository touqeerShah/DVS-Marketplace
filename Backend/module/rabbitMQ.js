const amqp = require("amqplib");
const { configObj } = require("./../config");
var {
    invoke,

} = require("../module/hyperledger-sdk");
var { updateTransaction, isExist } = require("./../pg-rabbitMQ");
var { initQueue } = require("../utils/helper");

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the args to the exchange with a routing key

class TransactionsMQ {
    channel;

    async createChannel() {
        console.log("configObj.rabbitMQ_url", configObj.rabbitMQ_url);
        const connection = await amqp.connect(configObj.rabbitMQ_url);
        this.channel = await connection.createChannel();
    }

    async transactions(uuid, routingKey, userId, data, pinHash) {
        try {
            if (!this.channel) {
                await this.createChannel();
            }

            const exchangeName = configObj.rabbitMQ_exchangeName;
            await this.channel.assertExchange(exchangeName, "direct");

            const logDetails = {
                uuid: uuid,
                logType: routingKey,
                userId: userId,
                data: data,
                pinHash: pinHash,
                dateTime: new Date(),
            };
            await this.channel.publish(
                exchangeName,
                routingKey,
                Buffer.from(JSON.stringify(logDetails))
            );

            console.log(
                `The new ${routingKey} log is sent to exchange ${exchangeName}`
            );
            return true;
        } catch (error) {
            console.log("error", error);
            return false;
        }
    }
    async createUser(uuid, routingKey, userId, isMint) {
        try {
            if (!this.channel) {
                await this.createChannel();
            }

            const exchangeName = configObj.rabbitMQ_exchangeName;
            await this.channel.assertExchange(exchangeName, "direct");

            const logDetails = {
                uuid: uuid,
                logType: routingKey,
                userId: userId,
                isMint: isMint,
                dateTime: new Date(),
            };
            await this.channel.publish(
                exchangeName,
                routingKey,
                Buffer.from(JSON.stringify(logDetails))
            );

            console.log(
                `The new ${routingKey} log is sent to exchange ${exchangeName}`
            );
            return true;
        } catch (error) {
            console.log("error", error);
            return false;
        }
    }
}
async function consumeInvoke() {
    try {
        console.log("configObj.rabbitMQ_url", configObj.rabbitMQ_url);
        const connection = await amqp.connect(configObj.rabbitMQ_url);
        var isLoaded = true;

        const channel = await connection.createChannel();
        const exchangeName = configObj.rabbitMQ_exchangeName;

        await channel.assertExchange(exchangeName, "direct");

        const q = await channel.assertQueue("InfoQueue", {
            durable: true,
        });

        await channel.bindQueue(q.queue, exchangeName, "invoke");
        console.log("q.queue", q.queue);

        channel.consume(
            q.queue,
            async (msg) => {
                if (msg !== null) {
                    var data = JSON.parse(msg.content.toString());
                    console.log("data.data", data);
                    var collrollerObject = await initQueue(data.data, {}, "POST"); /// this function is connect to mongoDB,get API Defination  and Network config for that bucket
                    console.log("1.collrollerObject ==>", collrollerObject);
                    console.log("isLoaded", isLoaded, data.uuid);
                    var isDataExist = isExist(data.uuid);
                    if (!isDataExist) {
                        channel.ack(msg);
                        isLoaded = true;
                        channel.recover();
                    }
                    if (isLoaded) {
                        isLoaded = false;
                        console.log("2.collrollerObject ==>", collrollerObject.requestData.parameters);

                        await
                            invoke(
                                collrollerObject.requestData.userId,
                                collrollerObject.apiConfig.data.channel,
                                collrollerObject.apiConfig.data.contractName,
                                collrollerObject.apiConfig.data.functionName,
                                collrollerObject.requestData.parameters,
                                collrollerObject.networkConfig.data,
                                data.pinHash
                            )
                                .then(async (value) => {
                                    console.log("value", value);

                                    await updateTransaction({
                                        status:
                                            value.status == 200
                                                ? "Transaction Successfull"
                                                : "Transaction Fail",
                                        error: value,
                                        uuid: data.uuid,
                                    });
                                    // if (value.status == 200) {
                                    channel.ack(msg);
                                    isLoaded = true;
                                    channel.recover();
                                    // }
                                    console.log("after transaction !", data.uuid);
                                    // isLoaded = true;
                                })
                                .catch(async (err) => {
                                    console.log(err);
                                    await updateTransaction({
                                        status: "Transaction Fail",
                                        error: err,
                                        uuid: data.uuid,
                                    });
                                    channel.ack(msg);
                                    channel.recover();
                                    isLoaded = true;
                                });
                    } else {
                        // setInterval(() => {
                        //   channel.recover();
                        // }, 1000);
                    }
                }
                // console.log(msg.content.toString());
                // channel.ack(msg);
            },
            { noAck: false }
        );
    } catch (error) {
        console.log("consumeInvoke", error);
    }
}
// async function consumeCreateUser() {
//   const connection = await amqp.connect(configObj.rabbitMQ_url);

//   const channel = await connection.createChannel();
//   const exchangeName = configObj.rabbitMQ_exchangeName;

//   await channel.assertExchange(exchangeName, "direct");

//   const q = await channel.assertQueue("InfoQueue");

//   await channel.bindQueue(q.queue, exchangeName, "createUser");
//   console.log("q.queue", q.queue);

//   channel.consume(q.queue, (msg) => {
//     console.log(msg.content.toString());
//     channel.ack(msg);
//   });
// }
// consumeCreateUser();
consumeInvoke();
module.exports = TransactionsMQ;
