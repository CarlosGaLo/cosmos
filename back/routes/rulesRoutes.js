const express = require("express");
const router = express.Router();
const rulesController = require("../controllers/rulesController");

// Obtener todas las reglas
router.get("/", rulesController.getRules);

// Obtener una regla por ID o sID
router.get("/:id", rulesController.getRuleByIdOrSID);

router.post("/", rulesController.createRule);
router.put("/:id", rulesController.updateRule);
router.delete("/:id", rulesController.deleteRule);

module.exports = router;
