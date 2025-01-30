const util = require("util");
const mysql = require("mysql2");
const config = require("config");

var dbConfig = {
  user: config.get("PGUser"),
  password: config.get("PGPassword"),
  host: config.get("PGServer"),
  database: config.get("PGDatabase"),
  waitForConnections: true,
};


var connection;
function handleDisconnect() {
  connection = mysql.createPool(dbConfig);
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
  console.log("create mysql connection");
  connection.query = util.promisify(connection.query);
}

handleDisconnect();
module.exports = { connection };
