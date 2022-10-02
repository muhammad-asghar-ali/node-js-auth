const jwt = require("jsonwebtoken")

module.exports.verfiyToken = async(req, res, next) => {
    try {
        // const header = req.headers['authorization']
        // const token = header.split(" ")[1]
        const cookie = req.headers.cookie
        if (!cookie) {
            return res.status(404).json({ error: "cookie expries login again" })
        }
        const token = cookie.split("=")[1]
        if (token === undefined) {
            return res.status(404).json({ error: "No token in the headers" })
        }
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({ error: "invalid token" })
            }
            req.id = user.id
        })
        next()
    } catch (err) {
        console.log({ error: err.message })
    }
}