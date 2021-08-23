"use strict";

// const POSTGRES_URI = process.env.POSTGRES_URI || 'postgres://localhost/postgres';
const POSTGRES_URI = process.env.POSTGRES_URI || "postgres://postgres@localhost:5432/postgres";
const { Sequelize, DataTypes } = require("sequelize");
const users = require("./userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "super-secret";
// const Collection = require("./collection-class");

var sequelize = new Sequelize(POSTGRES_URI, {});

const usersModel = users(sequelize, DataTypes);
usersModel.beforeCreate(async (user) => {
  let hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
});

usersModel.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ where: { username } });
 
  const isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    return user;
  }

  throw new Error("Invalid user");
};

usersModel.authenticateBearer = async function (token) {
  console.log(token);
  console.log(jwt.decode(token));

  const verifiedToken = jwt.verify(token, SECRET);

  
  const user = await this.findOne({
    where: { username: verifiedToken.username },
  });

  if (user) {
    return user;
  }
  throw new Error("Invalid user");
};


module.exports = {
  db: sequelize,
  Users: usersModel,
};