const express = require("express");
const { selectTable, selectOneRecord, insertRecord, updateRecord, deleteRecord, checkRecordExists, calculoDePuntos, calculoDePuntosComercios, selectComercio, selectAsociaciones, selectPermisos, selectByAdminPermisos, selectByAdmin } = require("../controllers/sqlFunctions");
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

router.get("/comercios/pagos/listar", (req,res) => {
    selectTable("pagos")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.send(err)
    })
});

router.post("/comercios/pagos/agregar", authenticate, (req,res) => {
    calculoDePuntosComercios("transacciones", "puntos_parciales", "ID_Comercio", req.body.ID_Comercio)
        .then((puntos) => {
            puntos = puntos[0]
            if(puntos.puntos_totales != null) {
                calculoDePuntosComercios("pagos", "monto_parcial", "ID_Comercio", req.body.ID_Comercio)
                .then((total) => { 
                    total = total[0]
                    if(total.puntos_totales != null) {
                        console.log(puntos.puntos_totales, total.puntos_totales)
                        if((puntos.puntos_totales - total.puntos_totales) > 0) {
                            if(Number(req.body.monto_parcial) <= (puntos.puntos_totales - total.puntos_totales)) {
                                const body = {...req.body, fecha: Date.now()};

                                insertRecord("pagos", body)
                                .then((results) => {
                                    res.status(201).json({ message: "El pago se ha agregado correctamente."})
                                })
                                .catch((err) => {
                                    res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
                                });
                            } else {
                                res.status(500).json({ error: "El monto ingresado es mayor al adeudado por el comercio" });
                            }
                        } else {
                            res.status(500).json({ error: "El comercio que selecciono tiene su deuda saldada" });
                        }
                    } else {
                        if(Number(req.body.monto_parcial) <= puntos.puntos_totales) {
                            const body = {...req.body, fecha: Date.now()};
    
                            insertRecord("pagos", body)
                            .then((results) => {
                                res.send(results)
                            })
                            .catch((err) => {
                                res.status(500).json({ error:"Se ha producido un error, intentelo nuevamente." });
                            });
                        } else {
                            res.status(500).json({ error: "El monto ingresado es mayor al adeudado por el comercio" });
                        }
                    }
                });
            } else {
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
        });
});

router.get("/comercios/pagos/listar/admin/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectPermisos(email)
    .then((results) => {
        selectByAdmin('pagos', 'ID_Comercio', results)
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

router.put("/comercios/pagos/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("pagos", req.body, "ID_Pagos", id)
    .then((results) => {
        res.status(200).json(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

router.delete("/comercios/pagos/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("pagos", "ID_Pagos", id)
    .then((results) => {
        res.status(200).json(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

//CRUD: CLIENTES ---------------------------------------------------------------------------------

router.get("/clientes/listar", (req,res) => {
    selectTable("clientes")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/clientes/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("clientes", "ID_Cliente", id)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/clientes/listar/comercio/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectComercio(id)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/clientes/listarByEmail/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectOneRecord("clientes", "email", email)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/clientes/listar/admin/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectPermisos(email)
    .then((results) => {
        selectByAdminPermisos(results)
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

router.get("/clientes/puntos/:id", authenticate, (req,res) => {
    const { id } = req.params;

    calculoDePuntos("transacciones", "ID_Cliente", id)
    .then((transacciones) => {
        res.send(transacciones);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

router.post("/clientes/agregar", authenticate, (req,res) => {
    const { email } = req.body;
    const password = req.body.password;

    delete req.body.password;

    insertRecord("clientes", req.body)
    .then((results) => {
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(password, salt).then((hashedPassword) => {
                const user = {
                    userId: uuidv4(),
                    email: email,
                    password: hashedPassword,
                    role: "cliente"
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
                                res.status(201).json({ message: "Cliente creado correctamente!" });
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
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            })
        })
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

//CRUD: TRANSACCION ---------------------------------------------------------------------------------

router.get("/transacciones/listar", (req,res) => {
    selectTable("transacciones")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/transacciones/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("transacciones", "ID_Transaccion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/transacciones/listar/comercio/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("transacciones", "ID_Comercio", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});

router.get("/transacciones/listar/admin/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectPermisos(email)
    .then((results) => {
        selectByAdmin('transacciones', 'ID_Comercio', results)
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

router.post("/transacciones/agregar", authenticate, (req,res) => {
    console.log(req.body)
    selectOneRecord("comercio", "ID_Comercio", req.body.ID_Comercio)
    .then((row) => {
        row = row[0];

        if(req.body.puntos_pago == "") {
            req.body.puntos_pago = 0;
        }

        const puntos = Number(req.body.monto_parcial) - Number(req.body.puntos_pago);
        const puntosFinales = calcularPuntos(row.porcentaje, puntos);
        delete req.body.puntos_parciales;

        req.body.monto_parcial = Number(req.body.monto_parcial)
        const body = {...req.body, puntos_parciales: puntosFinales, fecha: Date.now().toString()};
        if(Number(req.body.puntos_pago) > 0) {
            calculoDePuntos("transacciones", "ID_Cliente", req.body.ID_Cliente)
            .then((totales) => {
                totales = totales[0]

                if(req.body.puntos_pago > totales.puntos_totales) {
                    res.status(500).json({ error: "El cliente no posee esos puntos" });
                } else {
                    insertRecord("transacciones", body)
                    .then((results) => {
                        res.status(201).json({message: "Transaccion creada correctamente."})
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            })
        } else {
            insertRecord("transacciones", body)
            .then((results) => {
                res.status(201).json({message: "Transaccion creada correctamente."})
            })
            .catch((err) => {
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            })
        }
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

router.put("/transacciones/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("comercio", "ID_Comercio", req.body.ID_Comercio)
    .then((row) => {
        row = row[0];

        if(req.body.puntos_pago == "") {
            req.body.puntos_pago = 0;
        }

        const puntos = Number(req.body.monto_parcial) - Number(req.body.puntos_pago);
        const puntosFinales = calcularPuntos(row.porcentaje, puntos);
        delete req.body.puntos_parciales;

        req.body.monto_parcial = Number(req.body.monto_parcial)
        const body = {...req.body, puntos_parciales: puntosFinales};
        if(Number(req.body.puntos_pago) > 0) {
            calculoDePuntos("transacciones", "ID_Cliente", req.body.ID_Cliente)
            .then((totales) => {
                totales = totales[0]

                if(req.body.puntos_pago > totales.puntos_totales) {
                    res.status(500).json({ error: "El cliente no posee esos puntos" });
                } else {
                    updateRecord("transacciones", body, "ID_Transaccion", id)
                    .then((results) => {
                        res.status(200).json(results);
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            })
        } else {
            updateRecord("transacciones", body, "ID_Transaccion", id)
            .then((results) => {
                res.status(200).json(results);
            })
            .catch((err) => {
                res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
            })
        }
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

router.delete("/transacciones/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("transacciones", "ID_Transaccion", id)
    .then((results) => {
        res.status(200).json(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

//CRUD: ASOCIACIONES ---------------------------------------------------------------------------------

router.get("/asociaciones/listar", (req,res) => {
    selectTable("asociaciones")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});
router.get("/asociaciones/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("asociaciones", "ID_asociacion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});
router.get("/asociaciones/listar/admin/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectPermisos(email)
    .then((results) => {
        selectByAdmin('asociaciones', 'ID_Comercio', results)
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
router.post("/asociaciones/clientes/agregar", authenticate, (req,res) => {
    if(multipleAsociaciones(req.body.ID_Cliente, req.body.ID_Comercio, true)) {
        res.status(201).json({ message: "Asociaciones creadas correctamente!" });
    } else {
        res.status(500).json({ error: "Las asociaciones no se pudieron crear correctamente!" });
    }
});
router.post("/asociaciones/comercios/agregar", authenticate, (req,res) => {
    if(multipleAsociaciones(req.body.ID_Comercio, req.body.ID_Cliente, false)) {
        res.status(201).json({ message: "Asociaciones creadas correctamente!" });
    } else {
        res.status(500).json({ error: "Las asociaciones no se pudieron crear correctamente!" });
    }
});
router.delete("/asociaciones/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("asociaciones", "ID_asociacion", id)
    .then((results) => {
        res.status(200).json(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

async function multipleAsociaciones(datos, id, comercio) {
    const insert = datos.map(async (row) => {
        selectAsociaciones("asociaciones", {first: "ID_Comercio", second: "ID_Cliente"}, {first: (comercio ? id : row), second: (comercio ? row : id)})
        .then((results) => {
            if(results.length == 0) {
                insertRecord("asociaciones", {ID_Comercio: (comercio ? id : row), ID_Cliente: (comercio ? row : id)})
                .then((datos) => {
                    return true
                })
                .catch((err) => {
                    return null
                })
            } 
        })
        .catch((err) => {
            return null
        })
    })
    const resultados = await Promise.all(insert);

    return resultados
};

//CRUD: PERMISOS ---------------------------------------------------------------------------------

router.get("/admins/listar", (req,res) => {
    selectOneRecord("users", "role", "admin")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});
router.get("/admins/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("users", "userId", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
});
router.post("/admins/agregar", authenticate, (req,res) => {
    const { email } = req.body;
    const password = req.body.password;

    delete req.body.password;
    bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(password, salt).then((hashedPassword) => {
            const user = {
                userId: uuidv4(),
                email: email,
                password: hashedPassword,
                role: "admin"
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
                            if(permisos(req.body.ID_Comercio, req.body.email)) {
                                res.status(201).json({ message: "Admin creado correctamente!" });
                            } else {
                                res.status(500).json({ error: "El admin no se puedo crear correctamente!" })
                            }
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

router.delete("/admins/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("users", "userId", id)
    .then((results) => {
        res.status(200).json(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

async function permisos(datos, email) {
    const permisos = datos.map(async (row) => {
        insertRecord("permisos", {ID_Comercio: Number(row), ID_Admin: email})
        .then((permiso) => {
            return true
        })
        .catch((err) => {
            return null
        })
    })

    const resultados = await Promise.all(permisos);

    return resultados
}

// USERS ------------------------------------------------------------------------------------------

router.delete("/users/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("users", "email", id)
    .then((results) => {
        res.status(200).json(results);
    })
    .catch((err) => {
        res.status(500).json({ error: "Se ha producido un error, intentelo nuevamente." });
    })
})

module.exports = router;