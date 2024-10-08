const jwt = require("jsonwebtoken")
const { checkRecordExists } = require("../controllers/sqlFunctions")
require("dotenv").config()

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if(!token) {
        return res.status(401).json({ error: "Authentication required" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        if(decodedToken.userId) {
            let user = await checkRecordExists("users", "userId", decodedToken.userId);

            if(!user) {
                const cliente = await checkRecordExists("clientes", "ID_Cliente", decodedToken.userId);
                if(!cliente) {
                    return res.status(404).json({ error: "Usuario no encontrado." })
                }
                cliente.role = "cliente"
                
                user = cliente
            }
            
            req.user = user;
        } 

        next()
    } catch (err) {
        res.status(401).json({ error: "Token invalido." })
    }
}

module.exports = { authenticate }