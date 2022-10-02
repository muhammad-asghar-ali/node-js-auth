const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const { verfiyToken } = require("../middlewares/auth.middleware")


router.post("/register", userController.userRegister)
router.post("/login", userController.userLogin)
router.get("/user", verfiyToken, userController.getUser)


module.exports = router