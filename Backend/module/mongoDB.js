const { MongoClient } = require("mongodb");

/**
 * it will run before every thing and it should be connected
 * @param {*} url mongoDB url
 * @returns
 */
module.exports.connectMongoDB = async (url) => {
    try {
        console.log(url);
        const client = new MongoClient(url);
        // Use connect method to connect to the server
        await client
            .connect()
            .then(() => {
                console.log("Connected successfully to MongoDB");
            })
            .catch((error) => {
                console.log(
                    "Error To connect MongoDB try again after 5 second", error
                );
                process.exit(0);
            });

        return client;
    } catch (error) {
        console.log("Error To connect MongoDB try again after 5 second");
    }
};
/**
 * get data from DB
 * @param {*} client it object when we conect with mongoDB
 * @param {*} dbName  .. DB name
 * @param {*} collectionName collection name on which we have to find something
 * @param {*} findRequest  query on mongodb
 * @returns  status, message and data(api definiation or network configuration)
 */
module.exports.getCollection = async (
    client,
    dbName,
    collectionName,
    findRequest
) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const findResult = await collection.find(findRequest).toArray();
        var responseObj = {
            status: 200,
            data: findResult[0],
            message: "Successfull Fatch",
        };
        return responseObj;
    } catch (error) {
        var responseObj = { status: 404, data: [], message: error };
        return responseObj;
    }
};
