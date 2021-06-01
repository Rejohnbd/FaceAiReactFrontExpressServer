require("dotenv").config();
const app = require("./app");
const http = require("http");

const port = process.env.PORT || 2800;
const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server Start: ", port);
});
