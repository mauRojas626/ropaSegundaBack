const express = require('express');
const router = express.Router();

const prendaController = require("../controllers/Prenda");

router.route("/list").get(prendaController.GetAllPrendas)
router.route("/create").post(prendaController.CreatePrenda)
router.route("/edit").post(prendaController.EditPrenda)
router.route("/delete/:id").delete(prendaController.DeletePrenda)
router.route("/block/:id").get(prendaController.blockPrenda)
router.route("/unblock/:id").get(prendaController.unBlockPrenda)
module.exports = router;