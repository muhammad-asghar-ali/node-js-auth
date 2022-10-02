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
        res.status(500).json({ error: err.message })
    }
}

module.exports.refreshToken = async(req, res, next) => {
    try {
        // const header = req.headers['authorization']
        // const token = header.split(" ")[1]
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

            const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "35s" })

            // send cookiie
            res.cookie(user.id, token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 30),
                httpOnly: true,
                sameSite: "lax"
            })
            req.id = user.id
            next()
        })
        next()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}