const express = require("express");
require("dotenv").config();

const port = process.env.PORT;
const cors = require("cors");
const conn = require("./db/db")
const auth = require("./routes/auth")
const abm = require("./routes/abm")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

conn.connect(err => {
    if (err) return console.log("Failed to connect", err);
    console.log(`Successfully connected to mysql server: `);
});

app.get("/", async (req,res) => {
  res.send("Bienvenidos a la API")
});

app.use("/auth", auth);
app.use("/abm", abm);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});