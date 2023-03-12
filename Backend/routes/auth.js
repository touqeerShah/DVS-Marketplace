const express = require("express");
const {
  checkUserExist, createWeb3Message, verify, authenticateToken
} = require("../controller/auth");
const routerAuth = express.Router();
// following are the routes which we used to expose the  backend service
routerAuth.post("/checkUserExist", checkUserExist);
routerAuth.post("/get-message", createWeb3Message);
routerAuth.post("/verify-signature", verify);
routerAuth.post("/verify-token", authenticateToken);

module.exports = routerAuth;
