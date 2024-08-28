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
    query = `SELECT * FROM ${tableName}`;

    conn.query(query, (err, results) => {
      if(err) {
        reject(err)
      } else {
        resolve(results)
      }
    });
  })
}

const selectComercio = (value) => {
  return new Promise((resolve, reject) => {
    query = `SELECT * FROM clientes as p
            JOIN asociaciones as a on p.ID_Cliente = a.ID_Cliente
            WHERE a.ID_Comercio = ?;`;

    conn.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  })
}

const selectPermisos = (value) => {
  return new Promise((resolve, reject) => {
    query = `SELECT ID_Comercio FROM permisos WHERE ID_Admin = ?;`;

    conn.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  })
}

const selectByAdmin = (tableName, column, values) => {
  return new Promise((resolve, reject) => {
    query = `SELECT * FROM ${tableName} WHERE ${column} IN (${values.map(id => `${id}`).join(", ")});`;

    conn.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
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

const selectAsociaciones = (tableName, columns, values) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ${columns.first} = ? AND ${columns.second} = ?`;

    conn.query(query, [values.first, values.second], (err, results) => {
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
        resolve({message: "Se borro correctamente"});
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
        resolve({message: "Se edito correctamente"});
      }
    });
  });
}

const calculoDePuntos = (tableName, column, value) => {
  return new Promise((resolve, reject) => {

    const query = `SELECT ${column}, 
                  (SELECT SUM(puntos_parciales) FROM ${tableName} WHERE ${column} = ?)
                  -
                  (SELECT SUM(puntos_pago) FROM ${tableName} WHERE ${column} = ?) 
                  as puntos_totales, 
                  SUM(monto_parcial) AS monto_total FROM ${tableName} WHERE ${column} = ?`;

    conn.query(query, [value, value, value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const calculoDePuntosComercios = (tableName, suma, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT SUM(${suma}) as puntos_totales FROM ${tableName} WHERE ${column} = ?`;

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
  selectComercio,
  selectPermisos,
  selectByAdmin,
  selectOneRecord,
  selectAsociaciones,
  deleteRecord,
  updateRecord,
  calculoDePuntos,
  calculoDePuntosComercios
};