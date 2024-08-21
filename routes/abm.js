const express = require("express");
const { selectTable, selectOneRecord, insertRecord, updateRecord, deleteRecord, checkRecordExists, calculoDePuntos, calculoDePuntosComercios, selectComercio } = require("../controllers/sqlFunctions");
const { authenticate } = require("../middlewares/auth");
const { calcularPuntos } = require("../utils/calcularPuntos");

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();


//CRUD: COMERCIOS ---------------------------------------------------------------------------------

router.get("/comercios/listar", (req,res) => {
    selectTable("comercio")
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
        res.status(500).json({ error: err.message });
    })
});

router.get("/comercios/puntos/:id", authenticate, (req,res) => {
    const { id } = req.params;

    calculoDePuntosComercios("transacciones", "", "ID_Comercio", id)
    .then((transacciones) => {
        res.send(transacciones);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

router.post("/comercios/agregar", authenticate, (req,res) => {
    const { email } = req.body;
    const password = req.body.password;

    delete req.body.password;

    insertRecord("comercio", req.body)
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
                                res.status(500).json({ message: "No se puedo crear correctamente!" })
                            })
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    })
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            })
        })
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

router.put("/comercios/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("comercio", req.body, "ID_Comercio", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

router.delete("/comercios/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    checkRecordExists("comercio", "ID_Comercio", id)
    .then((exist) => {
        if(!exist) {
            res.status(404).json({ message: "Comercio no encontrado" })
        } else {

        }
        checkRecordExists("transacciones", "ID_Comercio", id)
        .then((exist2) => {
            if(exist2) {
                deleteRecord("transacciones", "ID_Comercio", id)
                .then(() => {
                    deleteRecord("asociaciones", "ID_Comercio", id)
                    .then(() => {
                        deleteRecord("comercio", "ID_Comercio", id)
                        .then((results) => {
                            res.send(results);
                        })
                    })
                })
            } else {
                deleteRecord("comercio", "ID_Comercio", id)
                .then((results) => {
                    res.send(results);
                })
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        })
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

//CRUD: PAGOS -----------

router.post("/comercios/pagos/agregar", authenticate, (req,res) => {
    calculoDePuntosComercios("transacciones", "ID_Comercio", req.body.ID_Comercio)
        .then((total) => {
            if(total) {
                if(total > 0) {
                    if(Number(req.body.pago) <= total) {
                        const body = {...req.body, fecha: Date.now()};

                        insertRecord("pagos", body)
                        .then((results) => {
                            res.send(results)
                        })
                        .catch((err) => {
                            res.status(500).json({ error: err.message });
                        });
                    } else {
                        res.status(500).json({ error: "El monto ingresado es mayor al adeudado por el comercio" });
                    }
                } else {
                    res.status(500).json({ error: "El comercio que selecciono tiene su deuda saldada" });
                }
            } else {
                res.status(500).json({ error: "Ha ocurrido un error, si el mismo persiste comuniquese con nosotros." });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});

router.put("/comercios/pagos/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("pagos", req.body, "ID_Pagos", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

router.delete("/comercios/pagos/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("pagos", "ID_Pagos", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

//CRUD: CLIENTES ---------------------------------------------------------------------------------

router.get("/clientes/listar", (req,res) => {
    selectTable("clientes")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});

router.get("/clientes/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("clientes", "ID_Cliente", id)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});

router.get("/clientes/listar/comercio/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectComercio(id)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});

router.get("/clientes/listarByEmail/:email", authenticate, (req,res) => {
    const { email } = req.params;
    selectOneRecord("clientes", "email", email)
    .then((results) => {
        res.send(results)
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});

router.get("/clientes/puntos/:id", authenticate, (req,res) => {
    const { id } = req.params;

    calculoDePuntos("transacciones", "ID_Cliente", id)
    .then((transacciones) => {
        res.send(transacciones);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
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
                                res.status(201).json({ message: "Usuario creado correctamente!" });
                            })
                            .catch((err) => {
                                res.status(500).json({ message: "No se puedo crear correctamente!" })
                            })
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    })
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            })
        })
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

router.put("/clientes/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("clientes", req.body, "ID_Cliente", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

router.delete("/clientes/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    checkRecordExists("clientes", "ID_Cliente", id)
    .then((exist) => {
        if(!exist) {
            res.status(404).json({ message: "Cliente no encontrado" });
        } else {
            checkRecordExists("transacciones", "ID_Cliente", id)
            .then((exist2) => {
                if(exist2) {
                    deleteRecord("transacciones", "ID_Cliente", id)
                    .then(() => {
                        deleteRecord("asociaciones", "ID_Cliente", id)
                        .then(() => {
                            deleteRecord("clientes", "ID_Cliente", id)
                            .then((results) => {
                                res.send(results);
                            })
                        })
                    })
                } else {
                    deleteRecord("clientes", "ID_Cliente", id)
                    .then((results) => {
                        res.send(results);
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            })
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })

})

//CRUD: TRANSACCION ---------------------------------------------------------------------------------

router.get("/transacciones/listar", (req,res) => {
    selectTable("transacciones")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});

router.get("/transacciones/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("transacciones", "ID_Transaccion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});

router.post("/transacciones/agregar", authenticate, (req,res) => {
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
                        res.send(results)
                    })
                    .catch((err) => {
                        console.log("entr2")
                        res.status(500).json({ error: err.message });
                    })
                }
            })
            .catch((err) => {
                console.log("entro1")
                res.status(500).json({ error: err.message });
            })
        } else {
            console.log(body)
            insertRecord("transacciones", body)
            .then((results) => {
                res.send(results)
            })
            .catch((err) => {
                console.log("entr2")
                res.status(500).json({ error: err.message });
            })
        }
    })
    .catch((err) => {
        console.log("entro3")
        res.status(500).json({ error: err.message });
    })
})

router.put("/transacciones/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("transacciones", req.body, "ID_Transaccion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

router.delete("/transacciones/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("transacciones", "ID_Transaccion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

//CRUD: ASOCIACIONES ---------------------------------------------------------------------------------

router.get("/asociaciones/listar", (req,res) => {
    selectTable("asociaciones")
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});
router.get("/asociaciones/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("asociaciones", "ID_asociacion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
});
router.post("/asociaciones/agregar", authenticate, (req,res) => {
    insertRecord("asociaciones", req.body)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})
router.put("/asociaciones/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("asociaciones", req.body, "ID_asociacion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})
router.delete("/asociaciones/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("asociaciones", "ID_asociacion", id)
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    })
})

module.exports = router;