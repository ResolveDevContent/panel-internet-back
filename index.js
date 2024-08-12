const express = require("express");
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
const conn = require("./db/db")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

conn.connect(err => {
    if (err) return console.log("Failed to connect");
    console.log(`Successfully connected to mariadb server: ${conn.serverVersion()}`);
});

app.use("/", (req,res) => {
    res.send("Bienvenido a la API");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});