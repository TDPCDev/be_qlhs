const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");

// Login
router.post("/", AuthController.login);

// Logout
module.exports = router;
