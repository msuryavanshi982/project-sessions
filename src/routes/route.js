const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const mid = require("../middleware/auth");

router.post("/register", userController.createUser); //create user

router.post("/login", userController.login); //login user

module.exports = router;
