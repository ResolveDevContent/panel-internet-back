const express = require("express");
require("dotenv").config();

const port = process.env.PORT;
const cors = require("cors");
const conn = require("./db/db")
const auth = require("./routes/auth")
const abm = require("./routes/abm")
const path = require("path");

const app = express();

conn.connect(err => {
  if (err) return console.log("Failed to connect", err);
  console.log(`Successfully connected to mysql server: `);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/panel-internet-front2/dist"))


app.get("/", async (req,res) => {
  res.sendFile(path.join(__dirname, "/panel-internet-front2/dist", "index.html"))
});

app.use("/auth", auth);
app.use("/abm", abm);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
