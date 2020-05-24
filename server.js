const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const http = require("http");
const passport = require("passport");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const fs = require("fs");
const cors = require("cors");

var app = express();

app.use(
  cors({
    //TODO: MUDAR PARA O URL DE DEPLOYMENT
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credential: true,
  })
);

//configurações de autenticação
require("./config/passport")(passport);

//configurar a base de dados
const db = require("./config/keys").MongoURI;

//connectar ao mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo Db Connected"))
  .catch((err) => console.log(err));

//bodyparser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//Express session
app.use(
  session({
    secret: "secret",
    name:"Auth",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, //este atributo designa o quanto tempo o browser fica com a cookie
      httpOnly: false,
      secure: false,
    },
  })
);

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
