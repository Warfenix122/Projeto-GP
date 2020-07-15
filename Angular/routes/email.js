const email = require('../config/sender.js');
const express = require("express");
const router = express.Router();

//// EMAILS
router.post("/sendEmail", (req, res) => {
  let to = req.body.to;
  let subject = req.body.subject;
  let content = req.body.content;
  email.sendEmail(to, subject, content);
})



router.post("/sendRecoverPasswordEmail", (req, res) => {
  let to = req.body.to;
  let password = req.body.password;
  email.sendRecoverPasswordEmail(to, password);
})

router.post("/sendConfirmProjectEmail", (req, res) => {
  let to = req.body.to;
  email.sendConfirmProjectEmail(to);
})

router.post("/sendChangesInProjectEmail", (req, res) => {
  let to = req.body.to;
  email.sendChangesInProjectEmail(to);
})

router.post("/sendProjectGuidelinesEmail", (req, res) => {
  let to = req.body.to;
  email.sendProjectGuidelinesEmail(to);
})

router.post("/sendQRCodeEmail", (req, res) => {
  let to = req.body.to;
  let attachment = req.body.attachment;
  email.sendQRCodeEmail(to, attachment);
})


module.exports = router;
