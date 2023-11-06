const express = require('express');
const router = express.Router();

const vendedorController = require("../controllers/Vendedor");

router.route("/:id").get(vendedorController.GetVendedor)
router.route("/create").post(vendedorController.CreateVendedor)
router.route("/edit").post(vendedorController.EditVendedor)
module.exports = router;