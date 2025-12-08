// routes/userCharacterRoutes.js
const express = require("express");
const router = express.Router();
const UserCharacterController = require("../controllers/userCharacterController");

// CRUD
router.get("/name/:name", UserCharacterController.getUserCharacterByName);
router.get("/:id", UserCharacterController.getUserCharacterById);
router.get("/", UserCharacterController.getAllUserCharacters);

router.post("/", UserCharacterController.createUserCharacter);

router.put("/:id", UserCharacterController.updateUserCharacter);

router.delete("/:id", UserCharacterController.deleteUserCharacter);

module.exports = router;
