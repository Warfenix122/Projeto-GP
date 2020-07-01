const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf-8");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
    const _id = user._id;
    const tipoMembro = user.tipoMembro;
    const nome = user.nome;
    const expiresIn = "1d";

    const payload = {
        sub: _id,
        tipoMembro: tipoMembro,
        nome: nome,
        iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: "RS256",
    });

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn,
    };
}

function getCurrentUserId(token) {
  var currentUser = jsonwebtoken.decode(token);
  return currentUser.sub;
}

function getCurrentUserRole(token){
  var currentUser = jsonwebtoken.decode(token);
  return currentUser.tipoMembro;
}


module.exports.issueJWT = issueJWT;
module.exports.getCurrentUserId = getCurrentUserId;
module.exports.getCurrentUserRole = getCurrentUserRole;
