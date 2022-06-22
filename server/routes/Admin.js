const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddleware");
const router = express.Router();
const { Users } = require("../models");

router.get("/all", validateToken, async (req, res) => {       
  const listOfUsers = await Users.findAll()
  res.json(listOfUsers);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listOfInfo = await Users.findByPk(id); 
  res.json(listOfInfo);
});

module.exports = router;