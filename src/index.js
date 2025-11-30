const app = require("./app");
const config = require("./config/config");

// console.log('Hello Node-Express-Mysql with Sequelize Boilerplate!!');
require("./cronJobs");

const https = require("https");
const http = require("http");
const fs = require("fs");

var key = fs.readFileSync("./certs/sade.key");
var cert = fs.readFileSync("./certs/sade.crt");
var options = {
  key: key,
  cert: cert,
}
const server = http.createServer(app);
// const server = https.createServer(app, options);
// eslint-disable-next-line import/order
const io = require("socket.io")(server, { cors: { origin: "*" } });

global.io = io;
require("./config/rootSocket")(io);

server.listen(config.port, () => {
  console.log("SERVER");
  console.log(`Listening to port ${config.port}`);
});