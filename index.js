const express = require("express");
require("dotenv").config();

const port = process.env.PORT;
const cors = require("cors");
const pool = require('./db/db');
const auth = require("./routes/auth")
const abm = require("./routes/abm")
const path = require("path");

const app = express();

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/panel-internet-front2/dist"))


app.use("/auth", auth);
app.use("/abm", abm);

app.get('/descargar-archivo', (req, res) => {
  const filePath = path.join(__dirname, '/panel-internet-front2/src/assets/files/plantilla.csv');
  res.download(filePath, 'plantilla.csv', (err) => {
    if (err) {
      console.log('Error al descargar el archivo:', err);
    }
  });
});

app.get("/*", async (req,res) => {
  res.sendFile(path.join(__dirname, "/panel-internet-front2/dist/index.html"))
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
