// var WebSocketServer = require("ws");

// function heartbeat() {
//   this.isAlive = true;
// }

// const wss_explorer = new WebSocketServer("ws://localhost:3000");
// wss_explorer.addEventListener("load", (e) => {
//   console.log("load", e);
// });

// wss_explorer.addEventListener("message", (e) => {
//   console.log("message", e);
// });

// wss_explorer.addEventListener("open", (e) => {
//   console.log("open");
//   wss_explorer.send("pharmatracechannel");
// });

const io = require("socket.io-client"),
  // ioClient = io.connect(
  //   "ws://a876454b3918f4ca4911638a7eac2d79-1361701552.eu-central-1.elb.amazonaws.com"
  // );
  ioClient = io.connect("wss://bc-con-socket.k8s.pharmatrace.io");

// Add a connect listener
ioClient.on("connect", function (ioClient) {
  console.log("Connected!", ioClient);
});
ioClient.emit("event", "pharmatracechannel");

ioClient.on("message", function (ioClient) {
  console.log("ioClient!", ioClient);
});

// const jwt = require("jsonwebtoken");
// const util = require("util");
// const jwtVerifyAsync = util.promisify(jwt.verify);

// async function test() {
//   const token =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZXhwbG9yZXJhZG1pbiIsIm5ldHdvcmsiOiJmaXJzdC1uZXR3b3JrIiwiaWF0IjoxNjYxNDMzNDAxLCJleHAiOjE2NjE0NDA2MDF9.R4a_0x1z5hndMLmJmFvQiQKYQDaiCj9z27AKH-sJKa0";
//   try {
//     var auth = await jwtVerifyAsync(token, "a secret phrase!!");
//     console.log("auth", auth.exp + 60 * 10);
//   } catch (err) {
//     console.log("err", err);
//   }
// }
// test();
