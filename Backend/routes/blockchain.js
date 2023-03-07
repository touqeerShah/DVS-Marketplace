const express = require("express");
const {
  register,
  insert,
  get,
  enrollAdmin, addQueue
} = require("../controller/blockchainController");
const router = express.Router();
// following are the routes which we used to expose the  backend service
router.post("/enrollAdmin", enrollAdmin);
router.post("/register", register);
router.post("/addQueue", addQueue);
router.post("/insert", insert);
router.post("/get", get);

module.exports = router;
