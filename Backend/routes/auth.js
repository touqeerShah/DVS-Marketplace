const express = require("express");
const {
  checkUserExist, createWeb3Message, verify, authenticateToken, verifyPin
} = require("../controller/auth");
const routerAuth = express.Router();
// following are the routes which we used to expose the  backend service
routerAuth.post("/checkUserExist", checkUserExist);
routerAuth.post("/get-message", createWeb3Message);
routerAuth.post("/verify-signature", verify);
routerAuth.post("/verify-token", authenticateToken);
routerAuth.post("/verify-pin", verifyPin);

module.exports = routerAuth;
