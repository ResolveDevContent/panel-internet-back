const config = {
    host: process.env.MDB_HOST,
    port: process.env.MDB_PORT,
    user: process.env.MDB_USER,
    // password: process.env.MDB_PASS,
    password: "damiansql",
    database: process.env.MDB_DB, 
};
  
module.exports = config;