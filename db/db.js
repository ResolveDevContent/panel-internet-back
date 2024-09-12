const mysql = require("mysql2");
const config = require("./config");

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: process.env.MDB_HOST,
    port: process.env.MDB_PORT,
    user: process.env.MDB_USER,
    password: process.env.MDB_PASS,
    database: process.env.MDB_DB,
    // Configuraciones adicionales
    connectionLimit: 10000, // Ajusta el límite de conexiones según tus necesidades
    waitForConnections: true, // Espera si no hay conexiones disponibles
    queueLimit: 0, // No limita el número de consultas en espera
    // Opciones de mantenimiento de la conexión
    enableKeepAlive: true,
    keepAliveInitialDelay: 3 * 1000, // 3 segundos
  });
  
  // Exportar el pool
  module.exports = pool.promise();