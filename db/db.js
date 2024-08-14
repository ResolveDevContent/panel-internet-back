const mysql = require("mysql2");
const config = require("./config");

const conn = mysql.createConnection(config);

module.exports = conn;