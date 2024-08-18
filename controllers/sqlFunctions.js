const conn = require("../db/db")

const createTable = (schema) => {
  return new Promise((resolve, reject) => {
    conn.query(schema, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const checkRecordExists = (tableName, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

    conn.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
};

const insertRecord = (tableName, record) => {
  return new Promise((resolve, reject) => {
    const placeHolder = Object.keys(record).map(() => "?").join(",");
    const query = `INSERT INTO ${tableName} (${Object.keys(record)}) VALUES (${placeHolder})`;

    conn.query(query, Object.values(record), (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const selectTable = (tableName) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName}`

    conn.query(query, (err, results) => {
      if(err) {
        reject(err)
      } else {
        resolve(results)
      }
    });
  })
}

const selectOneRecord = (tableName, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

    conn.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const deleteRecord = (tableName, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${tableName} WHERE ${column} = ?`;

    conn.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve("Se borro correctamente");
      }
    });
  });
}

const updateRecord = (tableName, update, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE ${tableName} SET ${Object.keys(update).map(key => `${key} = ?`).join(", ")} WHERE ${column} = ?`;
    const parameters = [...Object.values(update), value];

    conn.query(query, parameters, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve("Se edito correctamente");
      }
    });
  });
}

const calculoDePuntos = (tableName, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT ${column}, SUM(puntos_parciales) AS puntos_totales, SUM(monto_parcial) AS monto_total FROM ${tableName} WHERE ${column} = ?`;

    conn.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  createTable,
  checkRecordExists,
  insertRecord,
  selectTable,
  selectOneRecord,
  deleteRecord,
  updateRecord,
  calculoDePuntos,
};