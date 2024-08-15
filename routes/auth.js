const express = require("express");
const { register, login } = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

module.exports = router;