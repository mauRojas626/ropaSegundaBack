const express = require('express');
const router = express.Router();

const provinciaController = require("../controllers/Provincia");

router.route("/list").get(provinciaController.GetAllCities)
module.exports = router;