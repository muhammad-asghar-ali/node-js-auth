require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const db = require('./db')
const userRoutes = require("./routes/user.route")

const app = express()
app.use(cookieParser())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

db.connect()
const port = process.env.PORT || 5000

app.use("/api", userRoutes)

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})