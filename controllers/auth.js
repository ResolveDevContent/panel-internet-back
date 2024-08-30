const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const {
  createTable,
  checkRecordExists,
  insertRecord,
  selectOneRecord,
  updateRecord,
} = require("../controllers/sqlFunctions");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "7d" });
};

const changePassword = async(req) => {
  try{
    const newPassword = req.body.password;
    const email = req.body.email;

    if (!newPassword) {
      return { error: 'No se pudo cambiar la contraseña correctamente' };
    }
  
    const user = await selectOneRecord("users", "email", email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const update = {password: hashedPassword};

    const response = await updateRecord("users", update, "userId", user[0].userId);
    
    return response;
  } catch(e){
    return { error: error.message }
  }
}

const register = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ error: "Email y/o contraseña no pueden ser vacias!" });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = {
    userId: uuidv4(),
    email,
    password: hashedPassword,
    role: role
  };
  
  try {
    await createTable(userSchema);
    const userAlreadyExists = await checkRecordExists("users", "email", email);
    if (userAlreadyExists) {
      res.status(409).json({ error: "Email ya existente" });
    } else {
      await insertRecord("users", user);
      res.status(201).json({ message: "Usuario creado correctamente!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ error: "Email y/o contraseña no pueden ser vacias!" });
    return;
  }

  try {
    const existingUser = await checkRecordExists("users", "email", email);

    if (existingUser) {
      if (!existingUser.password) {
        res.status(401).json({ error: "Credenciales invalidas" });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (passwordMatch) {
        res.status(200).json({
          userId: existingUser.userId,
          email: existingUser.email,
          role: existingUser.role,
          token: generateAccessToken(existingUser.userId),
        });
      } else {
        res.status(401).json({ error: "Credenciales invalidas" });
      }
    } else {
      res.status(401).json({ error: "Credenciales invalidas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  changePassword
};