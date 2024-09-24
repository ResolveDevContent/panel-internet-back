const express = require("express");
const { selectTable, selectOneRecord, insertRecord, updateRecord, updateRecordCliente, deleteRecord, checkRecordExists, calculoDePuntos, calculoDePuntosComercios, selectComercio, selectAsociaciones, selectPermisos, selectByAdminPermisos, selectByAdmin } = require("../controllers/sqlFunctions");
const { authenticate } = require("../middlewares/auth");
const { calcularPuntos } = require("../utils/calcularPuntos");

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { changePassword } = require("../controllers/auth");

const router = express.Router();

//CRUD: COMERCIOS ---------------------------------------------------------------------------------

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

router.get("/comercios/puntos/:id", authenticate, (req,res) => {
    const { id } = req.params;

    calculoDePuntosComercios("transacciones", "puntos_parciales", "ID_Comercio", id)
    .then((puntos) => {
        if(puntos[0].puntos_totales != null) {
            puntos = puntos[0]
            calculoDePuntosComercios("pagos", "monto_parcial", "ID_Comercio", id)
            .then((total) => { 
                total = total[0]
                if(total.puntos_totales != null) {
                    const result = puntos.puntos_totales - total.puntos_totales
                    res.send([{puntos_totales: result}]);
                } else {
                    res.send([{puntos_totales: puntos.puntos_totales}])
                }
            })
            .catch((err) => {
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            })
        } else {
            res.send([{puntos_totales: 0}]);
        }
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

router.post("/comercios/agregar", authenticate, (req,res) => {
    const { email } = req.body;
    const password = req.body.password;

    delete req.body.password;
    insertRecord("comercio", {...req.body, activo: 1})
    .then((results) => {
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(password, salt).then((hashedPassword) => {
                const user = {
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
                            insertRecord("users", user)
                            .then((insert) => {
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
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

router.put("/comercios/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    if(req.body.password && req.body.password != "") {
        changePassword(req)
        .then((response) => {
            delete req.body.password
            updateRecord("comercio", req.body, "ID_Comercio", id)
            .then((results) => {
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
        console.error('Error retrieving payments:', err);
        res.status(500).send({ error: 'An error occurred while retrieving payments' });
    }
});

// Endpoint para agregar pagos
router.post("/comercios/pagos/agregar", authenticate, async (req, res) => {
    if (!req.body.ID_Comercio || req.body.ID_Comercio.length === 0) {
      return res.status(400).json({ error: "No se puede realizar un pago sin completar un comercio." });
    }
  
    try {
      // Calcular puntos parciales
      const [puntos] = await calculoDePuntosComercios("transacciones", "puntos_parciales", "ID_Comercio", req.body.ID_Comercio);
      if (!puntos || puntos.puntos_totales == null) {
        return res.status(400).json({ error: "El comercio seleccionado no tiene puntos acumulados." });
      }
  
      // Calcular puntos totales
      const [total] = await calculoDePuntosComercios("pagos", "monto_parcial", "ID_Comercio", req.body.ID_Comercio);
      if (!total || total.puntos_totales == null) {
        if (Number(req.body.monto_parcial) <= puntos.puntos_totales) {
          const body = { ...req.body, fecha: Date.now() };
          const result = await insertRecord("pagos", body);
          return res.status(201).json({ message: "El pago se ha agregado correctamente." });
        } else {
          return res.status(400).json({ error: "El monto ingresado es mayor al adeudado por el comercio." });
        }
      }
  
      if ((puntos.puntos_totales - total.puntos_totales) > 0) {
        if (Number(req.body.monto_parcial) <= (puntos.puntos_totales - total.puntos_totales)) {
          const body = { ...req.body, fecha: Date.now() };
          await insertRecord("pagos", body);
          return res.status(201).json({ message: "El pago se ha agregado correctamente." });
        } else {
          return res.status(400).json({ error: "El monto ingresado es mayor al adeudado por el comercio." });
        }
      } else {
        return res.status(400).json({ error: "El comercio que seleccionó tiene su deuda saldada." });
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
        const [permisos] = await selectPermisos(email);
        console.log("permisos", permisos)
        // Obtener pagos basados en los permisos
        const [datos] = await selectByAdmin('pagos', 'ID_Comercio', permisos);
        console.log("datos", datos)

        res.send(datos);
            
    } catch (err) {
      console.error('Error retrieving payments:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

router.put("/comercios/pagos/modificar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Actualizar el registro
      const results = await updateRecord("pagos", req.body, "ID_Pagos", id);
      res.status(200).json(results);
    } catch (err) {
      console.error('Error updating payment record:', err);
      res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
  });

router.delete("/comercios/pagos/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Borrar el registro
      const result = await deleteRecord("pagos", "ID_Pagos", id);
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
      const results = await selectTable("clientes");
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
        const transacciones = await calculoDePuntos("transacciones", "ID_Cliente", id);
        res.send(transacciones);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Importar clientes desde CSV
router.post("/clientes/importarcsv", authenticate, async (req, res) => {
    try {
        const result = await agregarClientes(req.body);
        if (result.every(r => r !== null)) {
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
    try {
        const results = await insertRecord("clientes", req.body);
        res.status(201).json({ message: "Cliente creado correctamente!" });
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
                ...row,
                nombre_completo: row.Nombre || "",
                direccion_principal: row["Direccion Principal"] || "",
                telefono_fijo: row.Telefono || "",
                telefono_movil: row.Telefono || ""
            };

            // Eliminar campos innecesarios
            delete cliente.Nombre;
            delete cliente["Direccion Principal"];
            delete cliente.Telefono;

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

// Agregar transacción
router.post("/transacciones/agregar", authenticate, async (req, res) => {
    if (req.body.ID_Comercio.length === 0 || req.body.ID_Cliente.length === 0) {
        return res.status(500).json({ error: "No se puede realizar una transacción sin completar todos los datos." });
    }

    try {
        req.body.puntos_pago = 0;

        const comercio = await selectOneRecord("comercio", "ID_Comercio", req.body.ID_Comercio);
        if (comercio.length === 0) {
            return res.status(500).json({ error: "Comercio no encontrado." });
        }

        const row = comercio[0];
        const puntos = Number(req.body.monto_parcial) - Number(req.body.puntos_pago);
        const puntosFinales = Number(calcularPuntos(row.porcentaje, puntos));

        req.body.puntos_parciales = puntosFinales;
        req.body.monto_parcial = Number(req.body.monto_parcial);

        // SACAR CUANDO SE HAGA LA VERSION 2
        const body = { ...req.body, fecha: Date.now().toString() };

        if (Number(req.body.puntos_pago) > 0) {
            const totales = await calculoDePuntos("transacciones", "ID_Cliente", req.body.ID_Cliente);
            if (Number(req.body.puntos_pago) > totales[0].puntos_totales) {
                return res.status(500).json({ error: "El cliente no posee esos puntos." });
            }
        }

        const results = await insertRecord("transacciones", body);
        res.status(201).json({ message: "Transacción creada correctamente." });
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Modificar transacción
router.put("/transacciones/modificar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const comercio = await selectOneRecord("comercio", "ID_Comercio", req.body.ID_Comercio);
        if (comercio.length === 0) {
            return res.status(500).json({ error: "Comercio no encontrado." });
        }

        const row = comercio[0];
        const puntos = Number(req.body.monto_parcial) - Number(req.body.puntos_pago);
        const puntosFinales = Number(calcularPuntos(row.porcentaje, puntos));

        req.body.puntos_parciales = puntosFinales;
        req.body.monto_parcial = Number(req.body.monto_parcial);
        const body = { ...req.body };

        if (Number(req.body.puntos_pago) > 0) {
            const totales = await calculoDePuntos("transacciones", "ID_Cliente", req.body.ID_Cliente);
            if (Number(req.body.puntos_pago) > totales[0].puntos_totales) {
                return res.status(500).json({ error: "El cliente no posee esos puntos." });
            }
        }

        const results = await updateRecord("transacciones", body, "ID_Transaccion", id);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Borrar transacción
router.delete("/transacciones/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await deleteRecord("transacciones", "ID_Transaccion", id);
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
    try {
        const results = await insertRecord("asociaciones", req.body);
        res.status(201).json({ message: "Asociación creada correctamente." });
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Ruta para agregar asociaciones entre clientes y comercios
router.post("/asociaciones/clientes/agregar", authenticate, async (req, res) => {
    const { ID_Cliente, ID_Comercio } = req.body;

    if (!ID_Cliente.length || !ID_Comercio.length) {
        return res.status(500).json({ error: "No se puede realizar una asociación sin completar todos los datos." });
    }

    try {
        const resultados = await multipleAsociaciones(ID_Cliente, ID_Comercio, true);

        if (resultados.every(result => result)) {
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

    if (!ID_Cliente.length || !ID_Comercio.length) {
        return res.status(500).json({ error: "No se puede realizar una asociación sin completar todos los datos." });
    }

    try {
        const resultados = await multipleAsociaciones(ID_Comercio, ID_Cliente, false);

        if (resultados.every(result => result)) {
            return res.status(201).json({ message: "Asociaciones creadas correctamente!" });
        } else {
            return res.status(500).json({ error: "Algunas asociaciones no se pudieron crear correctamente!" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Modificar asociación
router.put("/asociaciones/modificar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await updateRecord("asociaciones", req.body, "ID_asociacion", id);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Borrar asociación
router.delete("/asociaciones/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await deleteRecord("asociaciones", "ID_asociacion", id);
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

// Obtener todos los administradores
router.get("/admins/listar", async (req, res) => {
    try {
        const results = await selectOneRecord("users", "role", "admin");
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Obtener administrador por ID
router.get("/admins/listar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const results = await selectOneRecord("users", "userId", id);
        res.send(results);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Agregar administrador
router.post("/admins/agregar", authenticate, async (req, res) => {
    const { email, password, ID_Comercio } = req.body;

    if (!ID_Comercio || ID_Comercio.length === 0) {
        return res.status(500).json({ error: "No se puede agregar un admin sin comercios adheridos." });
    }

    try {
        const existingUser = await checkRecordExists("users", "email", email);
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

        if (await permisos(ID_Comercio, email)) {
            res.status(201).json({ message: "Admin creado correctamente!" });
        } else {
            res.status(500).json({ error: "El admin no se pudo crear correctamente!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

// Borrar administrador
router.delete("/admins/borrar/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteRecord("users", "userId", id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Se ha producido un error, inténtelo nuevamente." });
    }
});

async function permisos(datos, email) {
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

module.exports = router;