const mysql = require("mysql2");
const config = require("./config");

const conn = mysql.createConnection({
    host: process.env.MDB_HOST,
    port: process.env.MDB_PORT,
    user: process.env.MDB_USER,
    password: process.env.MDB_PASS, 
    database: process.env.MDB_DB, 
    // Keep alive packets should be sent
    enableKeepAlive: true,
    // We should start sending them early
    keepAliveInitialDelay: 3 * 1000, // 3 seconds
    // We don't want idle connections, but it's not mandatory for the fix to work, it seems
    maxIdle: 0,
    // Idle timeout much larger than keep alive delay and much smaller than MySQL's timeout setting
    idleTimeout: 5 * 60 * 1000 // 5 minutes
});

module.exports = conn;