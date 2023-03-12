const { Header, Payload, SIWWeb3 } = require("@web3auth/sign-in-with-web3");
const jwt = require("jsonwebtoken");
let { getDataFromMongoDB, loadMongo } = require("../utils/helper")
const { getKeys } = require("../module/keyStore");

const domain = "localhost";
const origin = "https://localhost/login";
let jwtSecret = "test my £$@£ secret DSG U@t 123";
createWeb3Message = async (req, res) => {
    const header = new Header();
    header.t = "eip191";

    const payload = new Payload();
    payload.domain = domain;
    payload.address = req.body.address;
    payload.uri = origin;
    payload.statement = `This just for verification of account ${req.body.address}`;
    payload.version = "1";
    payload.chainId = req.body.chainId;

    const message = new SIWWeb3({
        header,
        payload,
        network: "ethereum", // allowed values "solana", "ethereum", "starkware"
    });
    // console.log("payload", payload);
    // return message.prepareMessage();
    res.send({
        status: 200,
        message: message.prepareMessage(),
        nonce: payload.nonce,
        issuedAt: payload.issuedAt,
        statement: payload.statement,
        chainId: payload.chainId,
        uri: payload.uri,
    });
};

async function verifyMessage(jsonPayload) {
    console.log("jsonPayload", jsonPayload);
    const { header, payload, signature, network } = JSON.parse(jsonPayload);
    const message = new SIWWeb3({
        header,
        payload,
        network,
    });
    return await message.verify(payload, signature, network);
}

const verify = async (req, res) => {
    const isVerified = await verifyMessage(`{
    "header":{
       "t":"eip191"
    },
    "payload":{
       "domain":"${domain}",
       "address":"${req.body.address}",
       "statement":"${req.body.statement}",
       "uri":"${origin}",
       "version":"1",
       "chainId":${req.body.chainId},
       "nonce":"${req.body.nonce}",
       "issuedAt": "${req.body.issuedAt}"
    },
     "signature":{
        "s":"${req.body.signature}",
        "t":"eip191"
     },
     "network": "ethereum"
    }`);
    console.log("isVerified", isVerified);
    if (isVerified.success) {
        // if user is new
        // here we call register user function
        // also pass user pin hash for encryption
        // it will return public and we use it for token creation
        //else get public key only
        let verifiedAddress = req.body.address;
        const token = jwt.sign({ verifiedAddress }, jwtSecret, { expiresIn: "1d" });
        res.send({ status: 200, data: token });
        console.log("Verified!");
    } else {
        res.send({ status: 400, message: "unable to verify signature" });

        console.log("Not Verified!");
    }
};


const checkUserExist = async (req, res) => {
    let client = await loadMongo()
    var networkConfig = await getDataFromMongoDB(
        client,
        "Network",
        { name: req.body.organization },
        res
    );
    // console.log(networkConfig.data);
    if (networkConfig.data.status != 200) {
        res.send({ status: 400, message: "Error to connect Server Try again" })
        return networkConfig;
    } else {

        try {
            var getUser = {
                // query to check user is not exist
                _id: req.body.address,
            };
            var userIdentityRes = await getKeys(
                networkConfig.data.data.keyCounchdb.username,
                networkConfig.data.data.keyCounchdb.password,
                networkConfig.data.data.keyCounchdb.url,
                networkConfig.data.data.keyCounchdb.db_name,
                getUser
            );
            if (userIdentityRes.status == 200) {
                userIdentityRes.message = "user key already Found";
                res.send({ status: 200, message: "user exit", data: true })
                return;
            } else {
                res.send({ status: 404, message: "user not exit", data: false })

                return;
            }
        } catch (error) {

            // }
        };
    }

}

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log("  = > ", authHeader.split(" ")[1]);
    let token = authHeader.split(" ")[1];
    console.log("  = > ", token);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, authData) => {
        console.log(err, authData);

        if (err) return res.sendStatus(403);

        req.authData = authData;
        res.send({ status: 200, message: authData })
        next();
    });
}
module.exports = {
    createWeb3Message,
    verify,
    authenticateToken,
    checkUserExist
};
