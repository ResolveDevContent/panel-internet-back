const express = require("express");
const { selectTable, selectOneRecord, insertRecord, updateRecord, deleteRecord } = require("../controllers/sqlFunctions");
const { authenticate } = require("../middlewares/auth");
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
    insertRecord("comercio", req.body)
    .then((results) => {
        res.send(results);
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
    insertRecord("clientes", req.body)
    .then((results) => {
        res.send(results);
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
    insertRecord("transaccion", req.body)
    .then((results) => {
        res.send(results);
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