const express = require('express');
const router = express.Router();

const userController = require("../controllers/Usuario");

router.route("/").get(userController.GetAllUsers)
router.route("/create").post(userController.CreateUser)
router.route("/edit").post(userController.EditUser)
router.route("/:id").get(userController.GetUser)
module.exports = router;