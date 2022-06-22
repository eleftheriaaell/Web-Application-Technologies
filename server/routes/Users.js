const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const {validateToken} = require('../middlewares/AuthMiddleware')
const {sign} = require('jsonwebtoken')


router.post("/", async (req, res) => {
  const { username, password, password_confirmation, name, surname, email, phone_number, address, city, country, postal_code, afm } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      password_confirmation: password_confirmation,
      name: name,
      surname: surname,
      email: email,
      phone_number: phone_number,
      address: address,
      city: city,
      country: country,
      postal_code: postal_code,
      afm: afm,
      confirmation: "unconfirmed",      
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    res.json({error: "User doesn't exist"});
    return;
  }

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      res.json({error: "Wrong username/password combination"});
      return;
    }

    const accessToken = sign({username: user.username, id: user.id}, "importantsecret");

    res.json({token: accessToken, username: username, id: user.id, confirmation: user.confirmation});
  });
});

router.get('/auth', validateToken, (req, res) => {
  res.json(req.user)
});

router.get('/check/:username', async(req, res) => {
  const username = req.params.username;
  let Name = "AKIRO123"
  const user = await Users.findOne({ where: { username: username} });

  if(user != null){
    Name = user.username
  }
  res.json(Name)
});

router.get('/check2/:username', async(req, res) => {
  const username = req.params.username;

  const user = await Users.findOne({ where: { username: username} });
  res.json(user)
});

router.put('/confirm', async(req, res) => {
  const {confirmation, id} = req.body;
  await Users.update({confirmation: confirmation}, { where: { id: id } })
  res.json(confirmation);
}); 

module.exports = router;