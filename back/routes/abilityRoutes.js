const express = require("express");
const router = express.Router();
const abilityController = require("../controllers/abilityController");

router.get("/", abilityController.getAllAbilities);
router.get("/:idOrName", abilityController.getAbility);
router.post("/", abilityController.createAbility);
router.put("/:id", abilityController.updateAbility);
router.delete("/:id", abilityController.deleteAbility);

module.exports = router;
