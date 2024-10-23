const mysql = require('mysql2');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
    host: process.env.MDB_HOST,
    port: process.env.MDB_PORT,
    user: process.env.MDB_USER,
    password: process.env.MDB_PASS, 
    database: process.env.MDB_DB, 
};

// Función para crear un backup
function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '_');
    const backupFile = path.join(__dirname, `backup_${timestamp}.sql`);

    const command = `mysqldump -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > ${backupFile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al crear backup: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
    });
}

// Función para restaurar un backup
function restoreDatabase(backupFile) {
    const restoreBackupFile = path.join(__dirname, backupFile);

    const command = `mysql -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} < ${restoreBackupFile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al restaurar la base de datos: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
    });
}

// Función para listar archivos de backup
async function listBackups() {
    const backupDir = __dirname; // Directorio donde se guardan los backups

    fs.readdir(backupDir, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio:', err);
            return;
        }

        const backups = files.filter(file => file.startsWith('backup_') && file.endsWith('.sql'));
        backups.forEach(file => console.log(file));
        return backups
    });
}

// Exportar funciones
module.exports = { backupDatabase, restoreDatabase, listBackups };