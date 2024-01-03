const express = require("express");
const router = express.Router();
const register = require("../api/controllers/users/register");
const login = require("../api/controllers/users/login");

router.post("/register", register);
router.post("/login", login );
  

module.exports = router 
