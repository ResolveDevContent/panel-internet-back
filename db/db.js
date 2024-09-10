const mysql = require("mysql2");
const config = require("./config");

const conn = mysql.createConnection({
    host: process.env.MDB_HOST,
    port: process.env.MDB_PORT,
    user: process.env.MDB_USER,
    password: process.env.MDB_PASS, 
    database: process.env.MDB_DB, 
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default.
});

module.exports = conn;