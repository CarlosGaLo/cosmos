const express = require("express");
const router = express.Router();
const bodyPartController = require("../controllers/bodyPartController");

router.get("/", bodyPartController.getAllBodyParts);
router.get("/multiple", bodyPartController.getBodyPartsByIds);
router.get("/:idOrName", bodyPartController.getBodyPart);
router.post("/", bodyPartController.createBodyPart);
router.put("/:id", bodyPartController.updateBodyPart);
router.delete("/:id", bodyPartController.deleteBodyPart);

module.exports = router;
