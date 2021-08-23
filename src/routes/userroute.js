"use strict";
const express = require("express");

const router = express.Router();

const basicAuth = require("../middleware/basicAuth");
const bearerAuth = require("../middleware/bearerAuth");
const { Users } = require("../models/index");



router.post("/signup", (req, res) => {
 
  console.log(req.body);
  Users.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(400).send(err));
});

router.post("/signin", basicAuth(Users), (req, res) => {
 
  res.status(200).send(req.user);
});

router.get("/user", bearerAuth(Users), (req, res) => {
  res.status(200).send(req.user);
});

module.exports = router;