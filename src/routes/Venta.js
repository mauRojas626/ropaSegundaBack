const express = require('express');
const router = express.Router();

const ventaController = require("../controllers/Venta");

router.route("/list/:id").get(ventaController.GetAllVentas)
router.route("/create").post(ventaController.CreateVenta)
router.route("/validate").post(ventaController.ValidatePago)
router.route("/requestShip").post(ventaController.CreateEnvio)
router.route("/cotizarEnvio").post(ventaController.CotizarEnvio)
router.route("/payEnvio").post(ventaController.payEnvio)
router.route("/validateShip").post(ventaController.ValidarPago2)
router.route("/enviar").post(ventaController.Enviar)
router.route("/calificar").post(ventaController.CalificarVendedor)
module.exports = router;