var express = require('express');
var router = express.Router();
var glob = require("glob")
var ctrl_user = require('./api/controllers/user.controller.js');
var api_functions = require('./api/controllers/API_functions.js')
const bodyParser = require('body-parser');
var cron = require('node-cron');

const fs = require('fs');
var jwt = require('jsonwebtoken');
const app = express()
  .use(bodyParser.json());




router.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH ,DELETE ,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,origin,Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



// cron.schedule('* * 1-31 1-12 *', () => {
//   console.log("hrllo");
// });
// glob('../javascript/wallet/' + 'admin' + '.id', {}, function(er, files) {
//   // files is an array of filenames.
//   // If the `nonull` option is set, and nothing
//   // was found, then files is ["**/*.js"]
//   // er is an error object or null.
//   // console.log("files,", files);
//   var privateKey = fs.readFileSync(files[0], 'utf8');
//   var startindex = privateKey.indexOf("-----BEGIN PRIVATE KEY-----");
//   var privateKey = privateKey.substr(startindex-1);
//   var privateKey = privateKey.split("},\"mspId\"");
//   // var substringStart = privateKey.substr(endindex, privateKey.length);
// console.log(privateKey[0]);

// fs.unlink('../javascript/wallet/' + 'admin' + '.id', (err) => {
//         if (err) {
//             console.log("failed to delete local image:"+err);
//         } else {
//             console.log('successfully deleted local image');
//         }
// });
// var key = '{"credentials":{"certificate":"-----BEGIN CERTIFICATE-----\nMIICAjCCAaigAwIBAgIUcNM3kMIjtK6LJmVDwbB66yRi+nwwCgYIKoZIzj0EAwIw\nczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT\nE2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMjAxMTEzMDc0MDAwWhcNMjExMTEzMDc0\nNTAwWjAhMQ8wDQYDVQQLEwZjbGllbnQxDjAMBgNVBAMTBWFkbWluMFkwEwYHKoZI\nzj0CAQYIKoZIzj0DAQcDQgAESSzPIR4uAYtOeh7gy8jJMw2E8OArTbxkDGl6nkjM\ntw5lzU2i+8KI87loQT7Dd442gs2ZlI5yM/QiKehWsz5TEaNsMGowDgYDVR0PAQH/\nBAQDAgeAMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFBZp0r60/i38kG0egf+DpVi9\nrK2jMCsGA1UdIwQkMCKAIC1/+odYHTbOPDMMHN9Riu5YmJHr6cPbhT1Le2i4ArNK\nMAoGCCqGSM49BAMCA0gAMEUCIQDp+e0sGaea6sWCUrX1UpXttEjWtatW21jLQgOP\nc6NT+AIgOWsm+cPQCgTUdFeykrg2l6aOhbliPkYTSgSGB5PXY0s=\n-----END CERTIFICATE-----\n","privateKey":"-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgNbBMu5qI56mwsu1f\r\nU61zT/6R8j+hHfj8nNByHcjkocWhRANCAARJLM8hHi4Bi056HuDLyMkzDYTw4CtN\r\nvGQMaXqeSMy3DmXNTaL7wojzuWhBPsN3jjaCzZmUjnIz9CIp6FazPlMR\r\n-----END PRIVATE KEY-----\r\n"},"mspId":"Org1MSP","type":"X.509","version":1}'
// key = key.replace(/\n/g,"");
// fs.writeFile('../javascript/wallet/' + 'admin' + '.id', key, function (err) {
//   if (err) throw err;
//   console.log('File is created successfully.');
// });
  // console.log("privateKey", privateKey);
  // var token = jwt.sign({
  //   userid: req.body.user_id
  // }, privateKey, {
  //   algorithm: 'RS256'
  // }, {
  //   expiresIn: '1h'
  // });
  // console.log(token);
  // return_args.token = token
  // res.send(return_args)
//
// })


next_function = function(return_args) {
  console.log(return_args);
}

api_functions.query("system", 'mychannel', 'contract', 'CloseContract', next_function);
