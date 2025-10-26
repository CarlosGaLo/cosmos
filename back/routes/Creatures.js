const express = require("express");
const router = express.Router();
const creatureController = require("../controllers/creatureController");
const upload = require("../scripts/utils/multer");

router.get("/", creatureController.getAllCreatures);
router.get("/:idOrName", creatureController.getCreatureById);
router.get("/name/:name", creatureController.getCreatureByName);
router.post("/", upload.single("image"), creatureController.createCreature);
router.put("/:id", upload.single("image"), creatureController.updateCreatureById);
router.delete("/:id", creatureController.deleteCreatureById);

module.exports = router;
