const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const { verfiyToken, refreshToken } = require("../middlewares/auth.middleware")


router.post("/register", userController.userRegister)
router.post("/login", userController.userLogin)
router.get("/user", verfiyToken, userController.getUser)
router.get("/refresh", refreshToken, verfiyToken, userController.getUser)
router.post("/logout", verfiyToken, userController.userLogout)



module.exports = router