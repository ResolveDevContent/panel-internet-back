const pool = require("../db/db"); // Asegúrate de que `pool` esté exportado correctamente desde tu archivo de configuración

const createTable = async (schema) => {
  try {
    const [results] = await pool.query(schema);
    return results;
  } catch (err) {
    throw err;
  }
};

const checkRecordExists = async (tableName, column, value) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

  try {
    const [results] = await pool.query(query, [value]);
    return results.length ? results[0] : null;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
};
const insertRecord = async (tableName, record) => {
  const placeHolder = Object.keys(record).map(() => "?").join(",");
  const query = `INSERT INTO ${tableName} (${Object.keys(record)}) VALUES (${placeHolder})`;

  try {
    const [results] = await pool.query(query, Object.values(record));
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
};

const selectTable = async (tableName) => {
  const query = `SELECT * FROM ${tableName}`;

  try {
    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectComercio = async (value) => {
  const query = `SELECT DISTINCT clientes.* FROM clientes
            JOIN asociaciones on clientes.ID_Cliente = asociaciones.ID_Cliente
            WHERE asociaciones.ID_Comercio = ?;`;

  try {
    const [results] = await pool.query(query, [value]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectPermisos = async (value) => {
  const query = `SELECT ID_Comercio FROM permisos WHERE ID_Admin = ?;`;

  try {
    const [results] = await pool.query(query, [value]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectByAdmin = async (tableName, column, values) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} IN (${values.map(row => `${row.ID_Comercio}`).join(", ")});`;

  try {
    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectByAdminPermisos = async (values) => {
  const query = `SELECT DISTINCT clientes.* FROM clientes
            LEFT OUTER JOIN asociaciones on clientes.ID_Cliente = asociaciones.ID_Cliente
            WHERE asociaciones.ID_Comercio IN (${values.map(row => `${row.ID_Comercio}`).join(", ")});`;

  try {
    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const calcularPuntosTotales = async (tableName, column, sum, value) => {
  const query = `SELECT SUM(${sum}) AS total FROM ${tableName} WHERE ${column} = ?`;

  try {
    const [results] = await pool.query(query, [value]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectOneRecord = async (tableName, column, value) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

  try {
    const [results] = await pool.query(query, [value]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectOneDato = async (tableName, column, value, dato) => {
  const query = `SELECT ${dato} FROM ${tableName} WHERE ${column} = ?`;

  try {
    const [results] = await pool.query(query, [value]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectAsociaciones = async (tableName, columns, values) => {
  const query = `SELECT * FROM ${tableName} WHERE ${columns.first} = ? AND ${columns.second} = ?`;

  try {
    const [results] = await pool.query(query, [values.first, values.second]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectFechaLimite = async (tableName, column, value) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} <= ${value}`;

  try {
    const [results] = await pool.query(query, [value]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const selectOrderByASC = async (tableName, column, field, value) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} = ? ORDER BY ${field} ASC`;

  try {
    const [results] = await pool.query(query, [value]);
    return results;
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const deleteRecord = async (tableName, column, value) => {
  const query = `DELETE FROM ${tableName} WHERE ${column} = ?`;

  try {
    const [results] = await pool.query(query, [value]);
    return {message: "Se elimino correctamente"};
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}


const updateRecord = async (tableName, update, column, value) => {
  const query = `UPDATE ${tableName} SET ${Object.keys(update).map(key => `${key} = ?`).join(", ")} WHERE ${column} = ?`;
  const parameters = [...Object.values(update), value];

  try {
    const [results] = await pool.query(query, parameters);
    return {message: "Se actualizo correctamente"};
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

const updateRecordCliente = async (tableName, update, column, values) => {
  const query = `UPDATE ${tableName} SET ${Object.keys(update).map(key => `${key} = ?`).join(", ")} WHERE ${column.first} = ? AND ${column.second} = ?`;
  const parameters = [...Object.values(update), values.first, values.second];

  try {
    const [results] = await pool.query(query, parameters);
    return {message: "Se actualizo correctamente"};
  } catch (err) {
    console.error('Error executing query:', err); // Manejo de errores
    throw err; // Re-lanzar el error si deseas que el llamador maneje el error
  }
}

module.exports = {
  createTable,
  checkRecordExists,
  insertRecord,
  selectTable,
  selectComercio,
  selectPermisos,
  selectByAdmin,
  selectOneRecord,
  selectAsociaciones,
  selectFechaLimite,
  selectOrderByASC,
  deleteRecord,
  updateRecord,
  updateRecordCliente,
  calcularPuntosTotales,
  selectOneDato,
  selectByAdminPermisos,
};