const mysql = require("mysql");
const config = require("./config");

const conn = mysql.createConnection(config);

module.exports = conn;