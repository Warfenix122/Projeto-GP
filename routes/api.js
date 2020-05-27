const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//user model
const User = require("../models/mongoConnection").Utilizadores;

// //Login page
// router.get('/login',(req,res)=>{
//     res.render('login');
// });

// //Register Page
// router.get('/register',(req,res)=>{
//     res.render('register');
// });



//Register handle
router.post("/register", (req, res) => {
  console.log(req.body);
  const {
    nome,
    email,
    password,
    genero,
    dataDeNascimento,
    tipoMembro,
    areasInteresse,
    distrito,
    concelho,
    numeroTelefone,
    escola,
    formacao,
    selectedAreas
  } = req.body;
    console.log(req.body);
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //user already exists
        // errors.push({ msg: "Email is already registered" });
        // res.render("register", {
        //   errors,
        //   nome,
        //   email,
        //   password,
        //   password2,
        // });
        res.status(409).send('O email introduzido já foi registasdo');
      } else {
        const newUser = new User({
          nome,
          email,
          password,
          genero,
          dataDeNascimento,
          dataCriacao: Date.now(),
          areasInteresse : selectedAreas,
          distrito,
          concelho,
          tipoMembro,
          numeroTelefone,
          escola,
          formacao,
          aprovado : true
        });
        if(tipoMembro==="Voluntario Externo"){
          newUser.aprovado = false;
        }
        //Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set Password to hashed
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then((user) => {
                // req.flash('success_msg', 'You are now registered and can log in');
                //res.redirect("/users/login");
                res.status(200).send('Utilizador Registado com sucesso');
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  //}
});

//Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    // failureFlash: true,
  })(req, res, next);

});

//Logout handle
router.get("/logout", (req, res) => {
  req.logOut();
  // req.flash('success_msg','you are logged out');
  res.redirect("/");
});

router.get("/userAprove",(req,res)=>{
  User.find({})
});

module.exports = router;
