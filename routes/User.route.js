const express = require("express");

const UserController = require("../controllers/User.controller");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middleware/VerifyToken.middleware");
const router = express.Router();

// Create
router.post("/", verifyTokenAndAdmin, UserController.add);

// Get All
router.get("/", verifyTokenAndAdmin, UserController.getAll);

//Get by id
router.get("/:id", verifyTokenAndAuthorization, UserController.getById);

// Update
router.patch("/:id", verifyTokenAndAuthorization, UserController.update);

// delete
router.delete("/:id", verifyTokenAndAdmin, UserController.delete);

module.exports = router;
