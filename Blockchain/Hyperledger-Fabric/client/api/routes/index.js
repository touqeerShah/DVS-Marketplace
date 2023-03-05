var express = require("express");
var router = express.Router();
var api_functions = require("../controllers/API_functions.js");
var _ = require("lodash");

router.route("/login").post(async function (req, res) {
  console.log(req.body);

  await api_functions
    .query(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "Login",
      req.body.args
    )
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/getDeliveryItem").get(async function (req, res) {
  console.log(req.body);

  await api_functions
    .query(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "GetDeliveryItem",
      req.body.args
    )
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.route("/viewProductStatus").get(async function (req, res) {
  console.log(req.body);

  await api_functions
    .query(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "ViewProductStatus",
      req.body.args
    )
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/getDropDownUserID").get(async function (req, res) {
  console.log(req.body);

  await api_functions
    .query(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "GetDropDownUserID",
      req.body.args
    )
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/getUserDetail").get(async function (req, res) {
  console.log(req.body);

  await api_functions
    .query(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "GetUserDetail",
      req.body.args
    )
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/viewAllProductCreatedByMe").get(async function (req, res) {
  console.log(req.body);

  await api_functions
    .query(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "ViewAllProductCreatedByMe",
      req.body.args
    )
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/createUser").post(async function (req, res) {
  console.log(req.body.args.split(",")[3].replace(/\"/g, ""));
  var newUserId = req.body.args.split(",")[0].replace(/\"/g, "").replace("[", "");
  await api_functions
    .invoke(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "createUser",
      req.body.args
    )
    .then(async (value) => {
      if (value.status == 200) {
        await api_functions
          .registerUser(newUserId)
          .then((value) => {
            res.send(value);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send(value);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/createSupply").post(async function (req, res) {
  console.log(req.body.args.split(",")[3].replace(/\"/g, ""));
  var newUserId = req.body.args.split(",")[3].replace(/\"/g, "");
  await api_functions
    .invoke(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "CreateSupply",
      req.body.args
    )
    .then(async (value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/changeStatus").post(async function (req, res) {
  console.log(req.body.args.split(",")[3].replace(/\"/g, ""));
  var newUserId = req.body.args.split(",")[3].replace(/\"/g, "");
  await api_functions
    .invoke(
      req.body.loginUser,
      "mychannel",
      "user-managment",
      "ChangeStatus",
      req.body.args
    )
    .then(async (value) => {
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
