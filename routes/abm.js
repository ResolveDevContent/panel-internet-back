const express = require("express");
const { selectTable, selectOneRecord, insertRecord, updateRecord, deleteRecord, checkRecordExists } = require("../controllers/sqlFunctions");
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
});

router.get("/comercios/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("comercio", "ID_Comercio", id)
    .then((results) => {
        res.send(results);
    })
});

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
                                res.status(201).json({ message: "Usuario creado correctamente!" });
                            })
                        }
                    })
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            })
        })
    })
})

router.put("/comercios/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("comercio", req.body, "ID_Comercio", id)
    .then((results) => {
        res.send(results);
    })
})

router.delete("/comercios/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("comercio", "ID_Comercio", id)
    .then((results) => {
        res.send(results);
    })
})

//CRUD: CLIENTES ---------------------------------------------------------------------------------

router.get("/clientes/listar", (req,res) => {
    selectTable("clientes")
    .then((results) => {
        res.send(results);
    })
});

router.get("/clientes/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("clientes", "ID_Cliente", id)
    .then((results) => {
        res.send(results);
    })
});

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
                        }
                    })
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            })
        })
    })
})

router.put("/clientes/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("clientes", req.body, "ID_Cliente", id)
    .then((results) => {
        res.send(results);
    })
})

router.delete("/clientes/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("clientes", "ID_Cliente", id)
    .then((results) => {
        res.send(results);
    })
})

//CRUD: TRANSACCION ---------------------------------------------------------------------------------

router.get("/transaccion/listar", (req,res) => {
    selectTable("transaccion")
    .then((results) => {
        res.send(results);
    })
});

router.get("/transaccion/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("transaccion", "ID_Transaccion", id)
    .then((results) => {
        res.send(results);
    })
});

router.post("/transaccion/agregar", authenticate, (req,res) => {
    selectOneRecord("comercio", "ID_Comercio", req.body.ID_Comercio)
    .then((row) => {
        row = row[0];

        const puntos = calcularPuntos(row.porcentaje, req.body.monto_parcial)
        delete req.body.puntos_parciales;

        const body = {...req.body, puntos_parciales: puntos};

        insertRecord("transacciones", body)
        .then((results) => {
            res.send(results)
        })
    })
})

router.put("/transaccion/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("transaccion", req.body, "ID_Transaccion", id)
    .then((results) => {
        res.send(results);
    })
})

router.delete("/transaccion/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("transaccion", "ID_Transaccion", id)
    .then((results) => {
        res.send(results);
    })
})

//CRUD: ASOCIACIONES ---------------------------------------------------------------------------------

router.get("/asociaciones/listar", (req,res) => {
    selectTable("asociaciones")
    .then((results) => {
        res.send(results);
    })
});
router.get("/asociaciones/listar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    selectOneRecord("asociaciones", "ID_asociacion", id)
    .then((results) => {
        res.send(results);
    })
});
router.post("/asociaciones/agregar", authenticate, (req,res) => {
    insertRecord("asociaciones", req.body)
    .then((results) => {
        res.send(results);
    })
})
router.put("/asociaciones/modificar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    updateRecord("asociaciones", req.body, "ID_asociacion", id)
    .then((results) => {
        res.send(results);
    })
})
router.delete("/asociaciones/borrar/:id", authenticate, (req,res) => {
    const { id } = req.params;
    deleteRecord("asociaciones", "ID_asociacion", id)
    .then((results) => {
        res.send(results);
    })
})

module.exports = router;