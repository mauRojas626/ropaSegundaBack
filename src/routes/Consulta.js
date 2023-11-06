const express = require('express');
const router = express.Router();

const questionController = require("../controllers/Consulta");

router.route("/create").post(questionController.CreateConsulta)
router.route("/edit").post(questionController.EditConsulta)
module.exports = router;