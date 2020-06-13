const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const http = require("http");
const passport = require("passport");
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const session = require("express-session");
const fs = require("fs");
const cors = require("cors");
const del = require('del');

var app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(
  cors({
    //TODO: MUDAR PARA O URL DE DEPLOYMENT
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credential: true,
  })
);

del.sync('./uploads')
fs.mkdirSync('./uploads');
//configurações de autenticação
require("./config/passport")(passport);

//configurar a base de dados
const db = require("./config/keys").MongoURIProduction;

//connectar ao mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo Db Connected"))
  .catch((err) => console.log(err));

//bodyparser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//passport middlewere
app.use(passport.initialize());
app.use(passport.session());

//Pasta DIST do angular onde irá ser chamados os dois servidores
app.use(express.static("dist/Projeto-GP"));

const api = require("./routes/api");
app.use("/api", api);

app.get("*", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = http.createServer(app);

app.use(cors());

var angularConfig = {
  url: "http://localhost:" + PORT,
};

fs.writeFileSync(
  path.join(__dirname, "/src/assets/config.json"),
  JSON.stringify(angularConfig)
);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
