const express = require("express");
const { selectTable, selectOneRecord, insertRecord, updateRecord, deleteRecord, checkRecordExists, calculoDePuntos } = require("../controllers/sqlFunctions");
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

router.get("/comercios/puntos/:id", authenticate, (req,res) => {
    const { id } = req.params;

    calculoDePuntosComercios("transacciones", "ID_Comercio", id)
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

        const puntos = Number(req.body.monto_parcial) - Number(req.body.puntos_pago);
        const puntosFinales = calcularPuntos(row.porcentaje, puntos);
        delete req.body.puntos_parciales;

        const body = {...req.body, puntos_parciales: puntosFinales};

        insertRecord("transacciones", body)
        .then((results) => {
            res.send(results)
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        })
    })
    .catch((err) => {
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