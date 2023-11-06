const express = require('express');
const router = express.Router();

const fotoController = require("../controllers/Foto");

router.route("/create").post(fotoController.CreateFoto)

router.route("/:filename").get(fotoController.GetFoto)
module.exports = router;