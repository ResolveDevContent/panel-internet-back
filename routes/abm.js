const express = require("express");
const { selectTable, selectOneRecord, insertRecord, updateRecord, updateRecordCliente, deleteRecord, checkRecordExists, selectComercio, selectAsociaciones, selectPermisos, selectByAdminPermisos, selectByAdmin, calcularPuntosTotales, selectOrderByASC, selectFechaLimite, deleteRecordByAdmin } = require("../controllers/sqlFunctions");
const { authenticate } = require("../middlewares/auth");
const { calcularPuntos } = require("../utils/calcularPuntos");

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { changePassword } = require("../controllers/auth");

const { backupDatabase, restoreDatabase, listBackups } = require('../utils/backup');

const fs = require('fs');

const router = express.Router();

const cron = require('node-cron');

//CRUD: HISTORIAL ---------------------------------------------------------------------------------

router.get("/historial/listar", (req,res) => {
    selectTable("historial")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.send(err)
    })
});

router.get("/historial/listar/:id", (req,res) => {
    const { id } = req.params;
    selectOneRecord("historial", "ID_Historial", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.send(err)
    })
});

//COMERCIOS ---------------------------------------------------------------------------------

router.get("/comercios/listar", (req,res) => {
    selectOneRecord("comercio", "activo", 1)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.send(err)
    })
});

router.get("/comercios/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("comercio", "ID_Comercio", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.send(err)
    })
});

router.get("/comercios/listarByEmail/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectOneRecord("comercio", "email", email)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/comercios/listar/admin/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectPermisos(email)
    .then((results) => {
        selectByAdmin('comercio', 'ID_Comercio', results)
        .then((datos) => {
            res.send(datos)
        })
        .catch((err) => {
            res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
        })
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.post("/comercios/agregar", authenticate, (req,res) => {
    const { email, nombre_comercio } = req.body;
    const password = req.body.password;
    const user = req.body.user;
    delete req.body.user;

    delete req.body.password;
    checkRecordExists("comercio", "email", email)
    .then((comercioExist) => {
        if(comercioExist) {
            res.status(409).json({ error: "Comercio ya existente" });
        }

        insertRecord("comercio", {...req.body, activo: 1, puntos_totales: 0})
        .then((results) => {
            bcrypt.genSalt(10).then((salt) => {
                bcrypt.hash(password, salt).then((hashedPassword) => {
                    const addUser = {
                        userId: uuidv4(),
                        email: email,
                        password: hashedPassword,
                        role: "comercio"
                    };
                    
                    try {
                        checkRecordExists("users", "email", email)
                        .then((exist) => {
                            const userAlreadyExists = exist;
                            if (userAlreadyExists) {
                                res.status(409).json({ error: "Email ya existente" });
                            } else {
                                insertRecord("users", addUser)
                                .then( async (insert) => {
                                    const date = new Date().toLocaleString()
                                    let nombre_user = '';
                                    let nombre_superadmin = '';
                                    if(user.role == 'admin') {
                                        nombre_user = await selectOneRecord('admins', 'email', user.email)
                                    } else if(user.role == 'comercio') {
                                        nombre_user = await selectOneRecord('comercios', 'email', user.email)
                                    } else {
                                        nombre_superadmin = user.email
                                    }

                                    if(nombre_superadmin) {
                                        await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " agrego el comercio " + nombre_comercio, fecha: new Date(date).getTime()});
                                    } else {
                                        await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego el comercio " + nombre_comercio, fecha: new Date(date).getTime()});
                                    }
                                    res.status(201).json({ message: "Comercio creado correctamente!" });
                                })
                                .catch((err) => {
                                    res.status(500).json({ error: "No se puedo crear correctamente!" })
                                })
                            }
                        })
                        .catch((err) => {
                            res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
                        })
                    } catch (error) {
                        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
                    }
                }).catch((err) => {
                    res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente."});
                })
            })
        })
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

router.put("/comercios/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;

    if(req.body.password && req.body.password != "") {
        changePassword(req)
        .then((response) => {
            delete req.body.password
            updateRecord("comercio", req.body, "ID_Comercio", id)
            .then(async (results) => {
                const date = new Date().toLocaleString()
                let nombre_user = '';
                let nombre_superadmin = '';
                if(user.role == 'admin') {
                    nombre_user = await selectOneRecord('admins', 'email', user.email)
                } else if(user.role == 'comercio') {
                    nombre_user = await selectOneRecord('comercios', 'email', user.email)
                } else {
                    nombre_superadmin = user.email
                }

                if(nombre_superadmin) {
                    await insertRecord('historial', {message: "El" + user.role +  " " + nombre_superadmin + " modifico el comercio " + req.body.nombre_comercio, fecha: new Date(date).getTime()});
                } else {
                    await insertRecord('historial', {message: "El" + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " modifico el comercio " + req.body.nombre_comercio, fecha: new Date(date).getTime()});
                }
                res.status(200).json(results);
            })
            .catch((err) => {
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            })
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    } else {
        delete req.body.password;
        updateRecord("comercio", req.body, "ID_Comercio", id)
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
        })
    }
})

//CRUD: PAGOS -----------

router.get("/comercios/pagos/listar", async (req,res) => {
    try {
        const results = await selectTable("pagos");
        res.send(results);
    } catch (err) {
        res.status(500).send({ error: 'Se ha producido un error, intentelo nuevamente.' });
    }
});

// Endpoint para agregar pagos
router.post("/comercios/pagos/agregar", authenticate, async (req, res) => {
    const user = req.body.user;
    delete req.body.user;

    if (!req.body.ID_Comercio || req.body.ID_Comercio.length === 0) {
      return res.status(400).json({ error: "No se puede realizar un pago sin completar un comercio." });
    }
  
    try {
      // Calcular puntos parciales
        const comercio = await selectOneRecord('comercio', 'ID_Comercio', req.body.ID_Comercio);
        if (!comercio || comercio.length == 0 || Number(comercio[0].puntos_totales) == 0) {
            return res.status(400).json({ error: "El comercio seleccionado no tiene puntos acumulados." });
        }

        if (Number(req.body.monto_parcial) <= Number(comercio[0].puntos_totales)) {
            const date = new Date().toLocaleString()
            const body = { ...req.body, fecha: new Date(date).getTime() };
            await insertRecord("pagos", body);
            await updateRecord("comercio", {puntos_totales: Number(comercio[0].puntos_totales) - Number(req.body.monto_parcial)}, "ID_Comercio", req.body.ID_Comercio);
            let nombre_user = '';
            let nombre_superadmin = '';
            if(user.role == 'admin') {
                nombre_user = await selectOneRecord('admins', 'email', user.email)
            } else if(user.role == 'comercio') {
                nombre_user = await selectOneRecord('comercios', 'email', user.email)
            } else {
                nombre_superadmin = user.email
            }
            
            if(nombre_superadmin) {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " agrego un pago del comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
            } else {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego un pago del comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
            }
            return res.status(201).json({ message: "El pago se ha agregado correctamente." });
        } else {
            return res.status(400).json({ error: "El monto ingresado es mayor al adeudado por el comercio." });
        }
    } catch (err) {
      console.error('Error processing payment:', err);
      return res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.get("/comercios/pagos/listar/admin/:email", authenticate, async (req, res) => {
    const { email } = req.params;
  
    try {
        // Obtener permisos del admin
        let [permisos] = await selectPermisos(email);

        if(!Array.isArray(permisos)) {
            permisos = [permisos];
        }
        
        // Obtener pagos basados en los permisos
        let datos = await selectByAdmin('pagos', 'ID_Comercio', permisos);

        if(!Array.isArray(datos)) {
            datos = [datos];
        }
        res.send(datos);
            
    } catch (err) {
      console.error('Error retrieving payments:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.put("/comercios/pagos/modificar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;
  
    try {
        // Actualizar el registro
        const results = await updateRecord("pagos", req.body, "ID_Pagos", id);
        const comercio = await selectOneRecord('comercios', 'ID_Comercio', id)
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }
        
        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " modifico un pago del comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " modifico un pago del comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        }
        res.status(200).json(results);
    } catch (err) {
      console.error('Error updating payment record:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
  });

router.delete("/comercios/pagos/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;
  
    try {
      // Borrar el registro
        const pago = await selectOneRecord('pagos', 'ID_Pagos', id);
        const comercio = await selectOneRecord('comercio', 'ID_Comercio', pago[0].ID_Comercio);
        const results = await updateRecord("comercio", {puntos_totales: Number(comercio[0].puntos_totales) + Number(pago[0].monto_parcial)}, "ID_Comercio", comercio[0].ID_Comercio);
        const result = await deleteRecord("pagos", "ID_Pagos", id);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " borro un pago del comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " borro un pago del comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        }
        res.status(200).json(result);
    } catch (err) {
      console.error('Error deleting payment record:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

//CRUD: CLIENTES ---------------------------------------------------------------------------------

router.get("/clientes/listar", async (req, res) => {
    try {
      // Obtener los registros de clientes
      const results = await selectOneRecord("clientes", "activo", 1)
      res.status(200).send(results);
    } catch (err) {
      console.error('Error retrieving clients:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.get("/clientes/listar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Obtener el registro del cliente por ID
      const result = await selectOneRecord("clientes", "ID_Cliente", id);
  
      // Verificar si se encontró el cliente
      if (result.length === 0) {
        return res.status(404).json({ error: "Cliente no encontrado." });
      }
  
      res.send(result);
    } catch (err) {
      console.error('Error retrieving client record:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.get("/clientes/listar/zona/:zona", authenticate, async (req, res) => {
    const { zona } = req.params;
  
    try {
      // Obtener el registro del cliente por ID
      const result = await selectAsociaciones("clientes", {first: "zona", second: "activo"}, {first: zona, second: 1});
  
      // Verificar si se encontró el cliente
      if (result.length === 0) {
        return res.status(404).json({ error: "Cliente no encontrado." });
      }
  
      res.send(result);
    } catch (err) {
      console.error('Error retrieving client record:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener clientes por ID de comercio
router.get("/clientes/listar/comercio/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await selectComercio(id);
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener cliente por email
router.get("/clientes/listarByEmail/:email", authenticate, async (req, res) => {
    const { email } = req.params;
    try {
        const results = await selectOneRecord("clientes", "email", email);
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener clientes por permisos de administrador
router.get("/clientes/listar/admin/:email", authenticate, async (req, res) => {
    const { email } = req.params;
    try {
        const permisos = await selectPermisos(email);
        const datos = await selectByAdminPermisos(permisos);
        res.send(datos);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener puntos de cliente
router.get("/clientes/puntos/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const puntos = await calcularPuntosTotales("puntos", "ID_Cliente", 'puntos', id);
        const monto_total = await calcularPuntosTotales("transacciones", "ID_Cliente", 'monto_parcial', id);
        res.send([{puntos, monto_total}]);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Importar clientes desde CSV
router.post("/clientes/importarcsv", authenticate, async (req, res) => {
    const user = req.body.user;
    delete req.body.user;

    try {
        const result = await agregarClientes(req.body);
        if (result.every(r => r !== null)) {
            const date = new Date().toLocaleString()
            let nombre_user = '';
            let nombre_superadmin = '';
            if(user.role == 'admin') {
                nombre_user = await selectOneRecord('admins', 'email', user.email)
            } else if(user.role == 'comercio') {
                nombre_user = await selectOneRecord('comercios', 'email', user.email)
            } else {
                nombre_superadmin = user.email
            }

            if(nombre_superadmin) {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " agrego clientes a traves de un archivo csv", fecha: new Date(date).getTime()});
            } else {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego clientes a traves de un archivo csv", fecha: new Date(date).getTime()});
            }
            res.status(201).json({ message: "Clientes creados/editados correctamente!" });
        } else {
            res.status(500).json({ message: "No se pudieron agregar/editar los clientes correctamente!" });
        }
    } catch (err) {
        res.status(500).json({ message: "No se pudieron agregar/editar los clientes correctamente!" });
    }
});

// Agregar cliente
router.post("/clientes/agregar", authenticate, async (req, res) => {
    const user = req.body.user;
    delete req.body.user;

    const results = await selectAsociaciones("clientes", 
        { first: "Id", second: "Codigo" }, 
        { first: req.body.Id.toString(), second: req.body.Codigo.toString() }
    );

    if(results.length > 0) {
        return res.status(500).json({ error: "Ya existe el cliente" })
    }

    try {
        const results = await insertRecord("clientes", {...req.body, activo: 1});
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " agrego el cliente " + req.body.nombre, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego el cliente " + req.body.nombre, fecha: new Date(date).getTime()});
        }
        res.status(201).json({ message: "Cliente creado correctamente!" });
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.put("/clientes/modificar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;

    try {
        const results = await updateRecord("clientes", req.body, "ID_Cliente", id);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " modifico el cliente " + req.body.nombre, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " modifico el cliente " + req.body.nombre, fecha: new Date(date).getTime()});
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

async function agregarClientes(datos) {
    // Crear un array de promesas para inserciones y actualizaciones
    const promises = datos.map(async (row) => {
        if (row.Id && row.Codigo) {
            // Preparar el objeto cliente con valores predeterminados
            const cliente = {
                id: row.Id,
                codigo: row.Codigo,
                nombre: row.Nombre || "",
                apellido: row.apellido || "",
                dni: row.dni || "",
                direccion_principal: row["Direccion Principal"] || "",
                activo: 1
            };

            try {
                // Verificar si el cliente ya existe
                const results = await selectAsociaciones("clientes", 
                    { first: "Id", second: "Codigo" }, 
                    { first: row.Id.toString(), second: row.Codigo.toString() }
                );

                if (results.length === 0) {
                    // Insertar el nuevo cliente
                    await insertRecord("clientes", cliente);
                    return true;
                } else {
                    // Actualizar el cliente existente
                    await updateRecordCliente('clientes', cliente, 
                        { first: 'Id', second: 'Codigo' }, 
                        { first: row.Id.toString(), second: row.Codigo.toString() }
                    );
                    return true;
                }
            } catch (err) {
                console.error("Error en la operación con el cliente:", err);
                return false;
            }
        } else {
            // Retornar false si los datos están incompletos
            return false;
        }
    });

    // Esperar a que todas las promesas se resuelvan
    const resultados = await Promise.all(promises);

    return resultados;
}

//CRUD: TRANSACCION ---------------------------------------------------------------------------------

// Listar todas las transacciones
router.get("/transacciones/listar", async (req, res) => {
    try {
        const results = await selectTable("transacciones");
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener transacción por ID
router.get("/transacciones/listar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await selectOneRecord("transacciones", "ID_Transaccion", id);
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener transacciones por ID de comercio
router.get("/transacciones/listar/comercio/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await selectOneRecord("transacciones", "ID_Comercio", id);
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener transacciones por permisos de administrador
router.get("/transacciones/listar/admin/:email", authenticate, async (req, res) => {
    const { email } = req.params;
    try {
        const permisos = await selectPermisos(email);
        const datos = await selectByAdmin('transacciones', 'ID_Comercio', permisos);
        res.send(datos);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.get("/historial/transacciones/listar/:id", authenticate, async (req, res) => { 
    const { id } = req.params;
    try {
        const transacciones = await selectOneRecord("transacciones", "ID_Cliente", id);
        res.send(transacciones);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Agregar transacción
router.post("/transacciones/agregar", authenticate, async (req, res) => {
    const user = req.body.user;
    delete req.body.user;

    req.body.ID_Comercio = JSON.parse(req.body.ID_Comercio)
    req.body.ID_Cliente = JSON.parse(req.body.ID_Cliente)

    if (req.body.ID_Comercio.length === 0 || req.body.ID_Cliente.length === 0) {
        return res.status(500).json({ error: "No se puede realizar una transacción sin completar todos los datos." });
    }
    try {
        // if(!req.body.puntos_pago || req.body.puntos_pago == '') {
        //     req.body.puntos_pago = 0;
        // }

        const comercio = await selectOneRecord("comercio", "ID_Comercio", req.body.ID_Comercio);
        
        const row = comercio[0];
        // const puntos = Number(req.body.monto_parcial) - Number(req.body.puntos_pago);
        const puntos = Number(req.body.monto_parcial);
        const puntosFinales = Number(calcularPuntos(row.porcentaje, puntos));

        req.body.puntos_parciales = puntosFinales;
        req.body.monto_parcial = Number(req.body.monto_parcial);

        // const currentPay = Number(req.body.puntos_pago);
        const currentDate = Date.now(); 

        // SACAR CUANDO SE HAGA LA VERSION 2
        const body = { ...req.body, fecha: currentDate};

        // if (Number(req.body.puntos_pago) > 0) {
        //     const totales = await calcularPuntosTotales('puntos', 'ID_Cliente', 'puntos', req.body.ID_Cliente);
        //     if (Number(req.body.puntos_pago) > totales[0].total) {
        //         return res.status(500).json({ error: "El cliente no posee esos puntos." });
        //     } else {
        //         const puntos = await selectOrderByASC("puntos", "ID_Cliente", "fecha", req.body.ID_Cliente);

        //         let result = 0;
        //         let flag = false;
        //         puntos.forEach(async row => {
        //             result = currentPay - Number(row.puntos);
        //             if(!flag) {
        //                 if(result >= 0) {
        //                     if(result == 0) {
        //                         flag = true;
        //                     }
        //                     await deleteRecord("puntos", 'ID_puntos', row.ID_Puntos);
        //                     currentPay -= Number(row.puntos);
        //                 } else {
        //                     await updateRecord("puntos", {puntos: (result * -1)} , 'ID_Puntos', row.ID_Puntos);
        //                     flag = true;
        //                 }
        //             }
        //         });
        //     }
        // }

        if(puntosFinales > 0) {
            const sumaPuntos = Number(comercio[0].puntos_totales) + Number(puntosFinales);
            await insertRecord('puntos', {ID_Cliente: req.body.ID_Cliente, puntos: puntosFinales, fecha: currentDate});
            await updateRecord("comercio", {puntos_totales: sumaPuntos}, "ID_Comercio", req.body.ID_Comercio);
        }

        const results = await insertRecord("transacciones", body);
        const cliente = await selectOneRecord("clientes", 'ID_Cliente', req.body.ID_Cliente);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercio', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " +  nombre_superadmin + " agrego una transaccion del cliente " + cliente[0].nombre + " en el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        }else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego una transaccion del cliente " + cliente[0].nombre + " en el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        }
        res.status(201).json({ message: "Transacción creada correctamente." });
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Modificar transacción
// router.put("/transacciones/modificar/:id", authenticate, async (req, res) => {
//     const { id } = req.params;
//     try {
//         const comercio = await selectOneRecord("comercio", "ID_Comercio", req.body.ID_Comercio);
//         if (comercio.length === 0) {
//             return res.status(500).json({ error: "Comercio no encontrado." });
//         }

//         const row = comercio[0];
//         const puntos = Number(req.body.monto_parcial) - Number(req.body.puntos_pago);
//         const puntosFinales = Number(calcularPuntos(row.porcentaje, puntos));

//         req.body.puntos_parciales = puntosFinales;
//         req.body.monto_parcial = Number(req.body.monto_parcial);
//         const body = { ...req.body };

//         if (Number(req.body.puntos_pago) > 0) {
//             const totales = await calculoDePuntos("transacciones", "ID_Cliente", req.body.ID_Cliente);
//             if (Number(req.body.puntos_pago) > totales[0].puntos_totales) {
//                 return res.status(500).json({ error: "El cliente no posee esos puntos." });
//             }
//         }

//         const cliente = await selectOneRecord("clientes", 'ID_Cliente', req.body.ID_Clienteo);
//         const comercioNombre = await selectOneRecord("comercio", 'ID_Comercio', req.body.ID_Comercio);
//         await insertRecord('historial', {message: "Se modifico una transaccion del cliente " + cliente[0].nombre + " en el comercio " + comercioNombre[0].nombre_comercio, fecha: new Date(date).getTime()});
//         const results = await updateRecord("transacciones", body, "ID_Transaccion", id);
//         res.status(200).json(results);
//     } catch (err) {
//         res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
//     }
// });

// router.delete("/transacciones/totales", authenticate, async (req, res) => {
//     try {
//         const results = await calculoDeTotales();
//         res.status(200).json(results);
//     } catch (err) {
//         res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
//     }
// });

// Borrar transacción
router.delete("/transacciones/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;

    try {
        const transaccion = await selectOneRecord("transacciones", "ID_Transaccion", id);
        const cliente = await selectOneRecord("clientes", 'ID_Cliente', transaccion[0].ID_Cliente);
        const puntos = await selectAsociaciones("puntos", {first: "ID_Cliente", second: "fecha"}, {first: cliente[0].ID_Cliente, second: transaccion[0].fecha});
        const comercio = await selectOneRecord("comercio", 'ID_Comercio', transaccion[0].ID_Comercio);

        if(puntos && puntos.length > 0) {
            await deleteRecord("puntos", 'ID_Puntos', transaccion[0].ID_Puntos);
            await updateRecord("comercio", {puntos_totales: Number(comercio[0].puntos_totales) - Number(puntos[0].puntos)}, "ID_Comercio", comercio[0].ID_Comercio);
        }

        const results = await deleteRecord("transacciones", "ID_Transaccion", id);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " borro una transaccion del cliente " + cliente[0].nombre + " en el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " borro una transaccion del cliente " + cliente[0].nombre + " en el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

//CRUD: ASOCIACIONES ---------------------------------------------------------------------------------

// Listar asociaciones
router.get("/asociaciones/listar", async (req, res) => {
    try {
        const results = await selectTable("asociaciones");
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener asociación por ID
router.get("/asociaciones/listar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await selectOneRecord("asociaciones", "ID_asociacion", id);
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener asociaciones por permisos de administrador
router.get("/asociaciones/listar/admin/:email", authenticate, async (req, res) => {
    const { email } = req.params;
    try {
        const permisos = await selectPermisos(email);
        const datos = await selectByAdmin('asociaciones', 'ID_Comercio', permisos);
        res.send(datos);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Agregar asociación
router.post("/asociaciones/agregar", authenticate, async (req, res) => {
    const user = req.body.user;
    delete req.body.user;

    try {
        const results = await insertRecord("asociaciones", req.body);
        const cliente = await selectOneRecord("clientes", 'ID_Cliente', req.body.ID_Cliente);
        const comercioNombre = await selectOneRecord("comercio", 'ID_Comercio', req.body.ID_Comercio);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin){
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " agrego una asociacion del cliente " + cliente[0].nombre + " en el comercio " + comercioNombre[0].nombre_comercio, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego una asociacion del cliente " + cliente[0].nombre + " en el comercio " + comercioNombre[0].nombre_comercio, fecha: new Date(date).getTime()});
        }
        res.status(201).json({ message: "Asociación creada correctamente." });
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Ruta para agregar asociaciones entre clientes y comercios
router.post("/asociaciones/clientes/agregar", authenticate, async (req, res) => {
    const { ID_Cliente, ID_Comercio, ID_Zonas } = req.body;
    const user = req.body.user;
    delete req.body.user;

    if ((!ID_Zonas.length && !ID_Cliente.length) || !ID_Comercio.length) {
        return res.status(500).json({ error: "No se puede realizar una asociación sin completar todos los datos." });
    }

    if (ID_Zonas.length > 0 && ID_Cliente.length > 0) {
        return res.status(500).json({ error: "No se puede realizar una asociación con clientes y zonas" });
    }

    try {
        const datos = ID_Cliente.length > 0 ? ID_Cliente : ID_Zonas
        const resultados = await multipleAsociaciones(datos, ID_Comercio, true);

        if (resultados.every(result => result)) {
            const comercio = await selectOneRecord("comercio", 'ID_Comercio', ID_Comercio);
            const date = new Date().toLocaleString()
            let nombre_user = '';
            let nombre_superadmin = '';
            if(user.role == 'admin') {
                nombre_user = await selectOneRecord('admins', 'email', user.email)
            } else if(user.role == 'comercio') {
                nombre_user = await selectOneRecord('comercios', 'email', user.email)
            } else {
                nombre_superadmin = user.email
            }

            if(nombre_superadmin) {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " agrego asociaciones de clientes al comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
            } else {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego asociaciones de clientes al comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
            }
            return res.status(201).json({ message: "Asociaciones creadas correctamente!" });
        } else {
            return res.status(500).json({ error: "Algunas asociaciones no se pudieron crear correctamente!" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Ruta para agregar asociaciones entre comercios y clientes
router.post("/asociaciones/comercios/agregar", authenticate, async (req, res) => {
    const { ID_Cliente, ID_Comercio } = req.body;
    const user = req.body.user;
    delete req.body.user;

    if (!ID_Cliente.length || !ID_Comercio.length) {
        return res.status(500).json({ error: "No se puede realizar una asociación sin completar todos los datos." });
    }

    try {
        const resultados = await multipleAsociaciones(ID_Comercio, ID_Cliente, false);

        if (resultados.every(result => result)) {
            const cliente = await selectOneRecord("clientes", 'ID_Cliente', req.body.ID_Cliente);
            const date = new Date().toLocaleString()
            let nombre_user = '';
            let nombre_superadmin = '';
            if(user.role == 'admin') {
                nombre_user = await selectOneRecord('admins', 'email', user.email)
            } else if(user.role == 'comercio') {
                nombre_user = await selectOneRecord('comercios', 'email', user.email)
            } else {
                nombre_superadmin = user.email
            }

            if(nombre_superadmin) {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " agregaron asociaciones de comercios al cliente " + cliente[0].nombre, fecha: new Date(date).getTime()});
            } else {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agregaron asociaciones de comercios al cliente " + cliente[0].nombre, fecha: new Date(date).getTime()});
            }
            return res.status(201).json({ message: "Asociaciones creadas correctamente!" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Modificar asociación
router.put("/asociaciones/modificar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;

    try {
        const results = await updateRecord("asociaciones", req.body, "ID_asociacion", id);
        const cliente = await selectOneRecord("clientes", 'ID_Cliente', req.body.ID_Cliente);
        const comercio = await selectOneRecord("comercio", 'ID_Comercio', req.body.ID_Comercio);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }
        
        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " modifico la asociaciones del cliente " + cliente[0].nombre + " con el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " modifico la asociaciones del cliente " + cliente[0].nombre + " con el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Borrar asociación
router.delete("/asociaciones/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;
    
    try {
        const asociacion = await selectOneRecord("asociaciones", 'ID_asociacion', id);
        const cliente = await selectOneRecord("clientes", 'ID_Cliente', asociacion[0].ID_Cliente);
        const comercio = await selectOneRecord("comercio", 'ID_Comercio', asociacion[0].ID_Comercio);
        const results = await deleteRecord("asociaciones", "ID_asociacion", id);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " borro la asociaciones del cliente " + cliente[0].nombre + " con el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        } else {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " borro la asociaciones del cliente " + cliente[0].nombre + " con el comercio " + comercio[0].nombre_comercio, fecha: new Date(date).getTime()});
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

async function multipleAsociaciones(datos, id, comercio) {
    // Crear un array de promesas para las inserciones
    const insertPromises = datos.map(async (row) => {
        try {
            // Verificar si la asociación ya existe
            const results = await selectAsociaciones("asociaciones", 
                { first: "ID_Comercio", second: "ID_Cliente" }, 
                { first: (comercio ? id : row), second: (comercio ? row : id) }
            );

            // Si la asociación no existe, insertarla
            if (results.length === 0) {
                await insertRecord("asociaciones", 
                    { ID_Comercio: (comercio ? id : row), ID_Cliente: (comercio ? row : id) }
                );
                return true;
            } else {
                return false; // La asociación ya existe
            }
        } catch (err) {
            // Manejar errores y retornar false para indicar fallo
            console.error("Error en la asociación:", err);
            return false;
        }
    });

    // Esperar a que todas las promesas se resuelvan
    const resultados = await Promise.all(insertPromises);

    // Devolver los resultados de las inserciones
    return resultados;
}

//CRUD: PERMISOS ---------------------------------------------------------------------------------

router.get("/permisos/listar/admin/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectOneRecord("permisos", "ID_Admin", email)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

// Obtener todos los administradores
router.get("/admins/listar", async (req, res) => {
    try {
        const results = await selectTable("admins");
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener administrador por ID
router.get("/admins/listar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await selectOneRecord("admins", "ID_Admin", id);
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.get("/admins/listarByEmail/:email", authenticate, async (req,res) => {
    const { email } = req.params;
    try {
        const results = await selectOneRecord("admins", "email", email)
        res.send(results)
    }
    catch(err){
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    }
});

// Agregar administrador
router.post("/admins/agregar", authenticate, async (req, res) => {
    const { email, password, ID_Comercio, nombre, apellido } = req.body;
    const user = req.body.user;
    delete req.body.user;
    const permisos = Number(req.body.permisos);
    if (!ID_Comercio || ID_Comercio.length === 0) {
        return res.status(500).json({ error: "No se puede agregar un admin sin comercios adheridos." });
    }

    try {
        const existingUser = await checkRecordExists("admins", "email", email);
        if (existingUser) {
            return res.status(409).json({ error: "Email ya existente" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            userId: uuidv4(),
            email: email,
            password: hashedPassword,
            role: "admin"
        };

        const result = await insertRecord("users", user);
        const result2 = await insertRecord("admins", {nombre, apellido, email, permisos});

        if (await addPermisos(ID_Comercio, email)) {
            const date = new Date().toLocaleString()
            let nombre_user = '';
            let nombre_superadmin = '';
            if(user.role == 'admin') {
                nombre_user = await selectOneRecord('admins', 'email', user.email)
            } else if(user.role == 'comercio') {
                nombre_user = await selectOneRecord('comercios', 'email', user.email)
            } else {
                nombre_superadmin = user.email
            }
            
            if(nombre_superadmin) {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin+ " agrego el admin " + nombre, fecha: new Date(date).getTime()});
            }else {
                await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " agrego el admin " + nombre, fecha: new Date(date).getTime()});

            }
            res.status(201).json({ message: "Admin creado correctamente!" });
        } else {
            res.status(500).json({ error: "El admin no se pudo crear correctamente!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.put("/admins/modificar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user
    const admin = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        permisos: req.body.permisos
    }
    
    try {
        const updateAdmin = await updateRecord("admins", admin, "ID_Admin", id);
        
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
            const newPassword = {
                password: hashedPassword
            }
            
            const updateUser = await updateRecord("users", newPassword, "email", req.body.email);
        }

        const permisos = await selectOneRecord("permisos", "ID_Admin", req.body.email);
        for(const comercio of req.body.ID_Comercio) {
            const idxPermisos = permisos.findIndex((row) => row.ID_Comercio == comercio)

            if(idxPermisos == -1) {
                const updatePermisos = await insertRecord("permisos", {ID_Comercio: comercio, ID_Admin: req.body.email}, "ID_Admin", req.body.email);
            }
        }

        for(const permiso of permisos) {
            const idxComercios = req.body.ID_Comercio.findIndex((row) => row == permiso.ID_Comercio)

            if(idxComercios == -1) {
                const updatePermisos = await deleteRecord("permisos", "ID_Permisos", permiso.ID_Permisos);
            }
        }

        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }
        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " +nombre_superadmin + " actualizo el admin " + req.body.nombre, fecha: new Date(date).getTime()});

        }else {

            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " actualizo el admin " + req.body.nombre, fecha: new Date(date).getTime()});
        }
        res.status(200).json(updateAdmin);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Borrar administrador
router.delete("/admins/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const user = req.body.user;
    delete req.body.user;
    try {
        const admins = await selectOneRecord("admins", 'ID_Admin', id);
        const permisos = await selectOneRecord("permisos", "ID_Admin", admins[0].email);
        
        if(permisos.length > 0 ){
            const permisosborrar = await deleteRecord("permisos", "ID_Admin", admins[0].email);
        }
        
        const users = await deleteRecord("users", "email", admins[0].email);
        const result = await deleteRecord("admins", "ID_Admin", id);
        const date = new Date().toLocaleString()
        let nombre_user = '';
        let nombre_superadmin = '';
        if(user.role == 'admin') {
            nombre_user = await selectOneRecord('admins', 'email', user.email)
        } else if(user.role == 'comercio') {
            nombre_user = await selectOneRecord('comercios', 'email', user.email)
        } else {
            nombre_superadmin = user.email
        }

        if(nombre_superadmin) {
            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_superadmin + " borro el admin " + admins[0].nombre, fecha: new Date(date).getTime()});

        } else {

            await insertRecord('historial', {message: "El " + user.role +  " " + nombre_user.nombre ? nombre_user.nombre : nombre_user.nombre_comercio + " borro el admin " + admins[0].nombre, fecha: new Date(date).getTime()});
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

async function addPermisos(datos, email) {
    try {
        // Mapea los datos a promesas de inserción
        const permisosPromises = datos.map(async (row) => {
            try {
                // Intenta insertar el registro
                await insertRecord("permisos", { ID_Comercio: Number(row), ID_Admin: email });
                return true; // Retorna true si la inserción fue exitosa
            } catch (err) {
                // En caso de error, retorna null
                return null;
            }
        });

        // Espera a que todas las promesas se resuelvan
        const resultados = await Promise.all(permisosPromises);

        // Retorna los resultados
        return resultados;
    } catch (err) {
        // Maneja cualquier error inesperado aquí
        console.error("Error en la función permisos:", err);
        throw new Error("Error al procesar los permisos");
    }
}

// FECHA PUNTOS ------------------------------------------------------------------------------------------

router.post("/puntos/fecha/agregar", authenticate, async (req, res) => {
    if (!req.body.fecha || req.body.fecha === '') {
        return res.status(500).json({ error: "No hay una fecha establecida." });
    }

    try {
        const result = await updateRecord("fecha", req.body, 'ID_Fecha', 1);

        if (result) {
            const date = new Date().toLocaleString()
            await insertRecord('historial', {message: "Se actualizo el día de caducación de los puntos, el día " + req.body.fecha + " de cada mes", fecha: new Date(date).getTime()});
            setDate(req.body.fecha);
            res.status(201).json({ message: "Día actualizado correctamente!" });
        } else {
            res.status(500).json({ error: "El día no se actualizo correctamente!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.get("/puntos/fecha/listar", authenticate, async (req, res) => {
    try {
        const fecha = await selectTable("fecha");
        res.status(200).send(fecha);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

function setDate(date) {
    cron.schedule(`* * * ${Number(date)} * * `, () => {
        return caducarPuntos();
    });
}

async function caducarPuntos() {
    const now = Date.now();
    let month = now.getMonth() - 2;

    if((now.getMonth() - 2) == -1) {
        month = 11;
    }

    if((now.getMonth() - 2) == -2) {
        month = 10;
    }

    now.setMonth(month);
    
    try {
        const result = await selectFechaLimite("puntos", "fecha", now);
        if(result.length > 0) {
            result.forEach(async row => {
                await deleteRecord("puntos", 'ID_Puntos', row.ID_Puntos);
                const date = new Date().toLocaleString()
                await insertRecord('historial', {message: `Se borraron los puntos caducados hasta la fecha: ${new Date(now)}`, fecha: new Date(date).getTime()});
                return {message:  `Se borraron los puntos`}
            })
        } else {
            return {message: "No hay puntos hasta esa fecha"}
        }
    } catch (err) {
        return { error: "Se ha producido un error, inténtelo nuevamente." };
    }
}

// USERS ------------------------------------------------------------------------------------------

router.delete("/users/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteRecord("users", "email", id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// BACKUPS ------------------------------------------------------------------------------------------

router.post('/backup', authenticate, async (req, res) => {
    backupDatabase();
    const date = new Date().toLocaleString()
    await insertRecord('historial', {message: "Se creo exitosamente el backup", fecha: new Date(date).getTime()});

    res.status(200).json({ message: 'Backup en proceso...'});
});

router.post('/restore', authenticate, async (req, res) => {
    const { file } = req.body;
    if (!file) {
        return res.status(400).json({ error: 'Se requiere el nombre del archivo de backup.'});
    }
    restoreDatabase(file);
    const date = new Date().toLocaleString()
    await insertRecord('historial', {message: "Se restauro exitosamente el backup", fecha: new Date(date).getTime()});
    res.status(200).json({ message: 'Restauracion en proceso...'});
});

router.get('/backups', authenticate, async (req, res) => {
    // listBackups();
    const backupDir = "/var/www/panel-internet-back/utils"; // Directorio donde se guardan los backups

    fs.readdir(backupDir, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio:', err);
            return;
        }

        const backups = files.filter(file => file.startsWith('backup_') && file.endsWith('.sql'));
        res.status(200).send(backups);
    });

});


// ------------------------------------------------------------------------------------------

module.exports = router;
