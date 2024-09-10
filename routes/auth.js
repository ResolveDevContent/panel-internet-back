const express = require("express");
const { register, login, loginCliente, changePassword } = require("../controllers/auth");
const { authenticate } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login/cliente", loginCliente);

router.get("/perfil", authenticate, (req, res) => {
    res.json({ message: req.user})
})

router.put("/changepassword", changePassword);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

module.exports = router;