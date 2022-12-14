const UserModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports.userRegister = async(req, res, next) => {
    try {
        const { name, email, password } = req.body
        const alreadyExist = await UserModel.findOne({ email: email })
        if (alreadyExist) {
            return res.status(409).json({ error: "User already exist" })
        }
        const hashedPassword = bcrypt.hashSync(password)
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.userLogin = async(req, res, next) => {
    try {
        const { email, password } = req.body
        const alreadyExist = await UserModel.findOne({ email: email })
        if (!alreadyExist) {
            return res.status(400).json({ error: "User not exist" })
        }
        const isCorrectPassword = bcrypt.compareSync(password, alreadyExist.password)
        if (!isCorrectPassword) {
            return res.status(400).json({ error: "invalid password" })
        }
        const token = jwt.sign({ id: alreadyExist._id }, process.env.SECRET, { expiresIn: "35s" })

        if (req.cookies[`${alreadyExist._id}`]) {
            req.cookies[`${alreadyExist._id}`] = ""
        }
        // send cookiie
        res.cookie(alreadyExist._id, token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: "lax"
        })

        res.status(200).json({ message: "User login successfully", token, user: alreadyExist })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.getUser = async(req, res, next) => {
    try {
        const userId = req.id
        const user = await UserModel.findById(userId, "-password")
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.userLogout = async(req, res, next) => {
    try {
        const cookie = req.headers.cookie
        if (!cookie) {
            return res.status(404).json({ error: "cookie expries login again" })
        }
        const prevToken = cookie.split("=")[1]
        if (prevToken === undefined) {
            return res.status(404).json({ error: "No token in the headers" })
        }
        jwt.verify(prevToken, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({ error: "invalid token" })
            }
            res.clearCookie(`${user.id}`)
            req.cookies[`${user.id}`] = ""
            res.status(200).json({ messge: "user logout" })

        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}