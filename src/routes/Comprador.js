const express = require('express');
const router = express.Router();

const compradorController = require("../controllers/Comprador");

router.route("/list").get(compradorController.GetAllCompradores)
router.route("/:id").get(compradorController.GetComprador)
router.route("/create").post(compradorController.CreateComprador)
router.route("/edit").post(compradorController.EditComprador)
router.route("/validate").post(compradorController.ValidateUser)
router.route("/validateRuc").post(compradorController.ValidateRuc)
module.exports = router;